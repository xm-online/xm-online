import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DEFAULT_AUTH_TOKEN, DEFAULT_CONTENT_TYPE } from '../../xm.constants';
import { StateStorageService } from './state-storage.service';
import { Principal } from './principal.service';

const TOKEN_STORAGE_KEY = 'WALLET-TOKEN';

const DEFAULT_HEADERS = {
    'Content-Type': DEFAULT_CONTENT_TYPE,
    'Authorization': DEFAULT_AUTH_TOKEN
};

const REFRESH_TOKEN = 'refresh_token';
const AUTH_TOKEN = 'authenticationToken';
const ACCESS_TOKEN = 'access_token';

const _TOKEN_URL = 'uaa/oauth/token';
const _CONFIG_SETTINGS_API = 'config/api/profile/webapp/settings-public.yml?toJson';

const EXPIRES_DATE_FIELD = 'authenticationTokenexpiresDate';

const WIDGET_DATA = 'widget:data';

export const TOKEN_URL = _TOKEN_URL;
export const CONFIG_SETTINGS_API = _CONFIG_SETTINGS_API;


@Injectable()
export class AuthServerProvider {

    constructor(
        private principal: Principal,
        private http: HttpClient,
        private $localStorage: LocalStorageService,
        private $sessionStorage: SessionStorageService,
        private stateStorageService: StateStorageService,
        private router: Router
    ) {
        this.setAutoRefreshTokens();
    }

    getToken() {
        return this.$localStorage.retrieve(AUTH_TOKEN) || this.$sessionStorage.retrieve(AUTH_TOKEN);
    }

    getRefreshToken() {
        return this.$localStorage.retrieve(REFRESH_TOKEN) || this.$sessionStorage.retrieve(REFRESH_TOKEN);
    }

    private storeAT(resp: any, rememberMe: boolean): string {
        const accessToken = resp[ACCESS_TOKEN];
        if (accessToken) {
            this.storeAuthenticationToken(accessToken, rememberMe);
        }
        return accessToken;
    }

    private storeRT(resp: any, rememberMe: boolean) {
        const refreshToken = resp[REFRESH_TOKEN];
        if (refreshToken) {
            const authenticationTokenexpiresDate = new Date().setSeconds(resp['expires_in']);
            // console.log('Expires in: ' + authenticationTokenexpiresDate);
            this.$sessionStorage.store(EXPIRES_DATE_FIELD, authenticationTokenexpiresDate);
            this.storeRefreshToken(refreshToken, rememberMe);
            setTimeout(() => {
                this.refreshTokens();
            }, (resp['expires_in'] - 60) * 1000);
        } else {
            console.log('Expected to get %s but got undefined', REFRESH_TOKEN);
        }
    }

    private getAccessToken(data, headers, rememberMe): Observable<any> {
        return this.http.post(TOKEN_URL, data, { headers: headers, observe: 'response'}).pipe(map((resp) => {
            this.$sessionStorage.clear(TOKEN_STORAGE_KEY);
            const result = resp.body;
            let accessToken;
            let tfaChannel = '';

            if ('required' === resp.headers.get('icthh-xm-tfa-otp')) {
                tfaChannel = resp.headers.get('icthh-xm-tfa-otp-channel');
                console.log('tfaRequired=%s using %s', true, tfaChannel);

                this.stateStorageService.storeDestinationState(
                    {
                        'name': 'otpConfirmation',
                        'data': {'tfaVerificationKey': result['tfaVerificationKey'], 'tfaChannel': tfaChannel}
                    },
                    {},
                    {'name': 'login'});

                accessToken = this.storeAT(result, rememberMe);
            } else {
                this.stateStorageService.resetDestinationState();
                accessToken = this.storeAT(result, rememberMe);
                this.storeRT(result, rememberMe);
            }

            return accessToken;

        }));
    }

    login(credentials): Observable<any> {
        let data = new HttpParams();
        this.$sessionStorage.clear(WIDGET_DATA);

        if (credentials && !credentials.grant_type) {
            data = data.append('grant_type', 'password');
            data = data.append('username', credentials.username);
            data = data.append('password', credentials.password);
        } else {
            data = data.append('grant_type', credentials.grant_type);
            if ('tfa_otp_token' === credentials.grant_type) {
                data = data.append('otp', credentials.otp);
                data = data.append('tfa_access_token_type', 'bearer');
                data = data.append('tfa_access_token', this.getToken());
            } else {
                data = data.append('username', credentials.username);
                data = data.append('password', credentials.password);
            }
        }

        return this.getAccessToken(data, DEFAULT_HEADERS, credentials.rememberMe);

    }

    loginWithToken(jwt, rememberMe) {
        this.$sessionStorage.clear(WIDGET_DATA);
        if (jwt) {
            this.storeAuthenticationToken(jwt, rememberMe);
            return Promise.resolve(jwt);
        } else {
            return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
        }
    }

    storeAuthenticationToken(jwt, rememberMe) {
        if (rememberMe) {
            this.$localStorage.store(AUTH_TOKEN, jwt);
        } else {
            this.$sessionStorage.store(AUTH_TOKEN, jwt);
        }
    }

    storeRefreshToken(jwt, rememberMe) {
        if (rememberMe) {
            this.$localStorage.store(REFRESH_TOKEN, jwt);
        } else {
            this.$sessionStorage.store(REFRESH_TOKEN, jwt);
        }
    }

    logout(): Observable<any> {
        return new Observable(observer => {
            this.$localStorage.clear(AUTH_TOKEN);
            this.$sessionStorage.clear(AUTH_TOKEN);
            this.$localStorage.clear(REFRESH_TOKEN);
            this.$sessionStorage.clear(REFRESH_TOKEN);
            this.$sessionStorage.clear(TOKEN_STORAGE_KEY);
            this.$localStorage.clear(EXPIRES_DATE_FIELD);
            this.$sessionStorage.clear(EXPIRES_DATE_FIELD);
            this.$sessionStorage.clear(WIDGET_DATA);
            observer.next();
            observer.complete();
        });
    }

    private refreshTokens() {
        const headers = {
            'Authorization': DEFAULT_AUTH_TOKEN,
            'Content-Type': DEFAULT_CONTENT_TYPE,
            'Accept': 'application/json'
        };

        const body = new HttpParams()
            .set('grant_type', 'refresh_token')
            .set('refresh_token', this.getRefreshToken())
        ;

        this.http.post<any>(TOKEN_URL, body, { headers: headers, observe: 'response'})
            .pipe(map((resp) => { return resp.body; }))
            .subscribe(data => {
                if (data.access_token) {
                    this.storeAuthenticationToken(data.access_token, false);
                    const authenticationTokenexpiresDate = new Date().setSeconds(data.expires_in);
                    this.$sessionStorage.store(EXPIRES_DATE_FIELD, authenticationTokenexpiresDate);
                    this.setAutoRefreshTokens();
                }
            }, error => {
                console.log('Refresh token fails: %o', error);
                this.logout().subscribe();
                this.principal.logout();
                this.router.navigate(['']);
            });

    }

    private setAutoRefreshTokens() {
        if (this.getRefreshToken()) {
            const currentDate = new Date().setSeconds(0);
            const expiresdate = this.$sessionStorage.retrieve(EXPIRES_DATE_FIELD);
            if (currentDate < expiresdate) {
                const expires_in = (expiresdate - currentDate) / 1000 - 30;
                // console.log('will refresh token after seconds', expires_in);
                setTimeout(() => {
                    if (this.getRefreshToken()) {
                        this.refreshTokens();
                    }
                }, expires_in * 1000);
            } else {
                this.refreshTokens();
            }
        }
    }
}
