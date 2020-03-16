import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { XmSessionService } from '@xm-ngx/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { DEFAULT_AUTH_TOKEN, DEFAULT_CONTENT_TYPE } from '../../xm.constants';
import { CustomUriEncoder } from '../helpers/custom-uri-encoder';
import { Principal } from './principal.service';
import { StateStorageService } from './state-storage.service';

const TOKEN_STORAGE_KEY = 'WALLET-TOKEN';

const DEFAULT_HEADERS = {
    'Content-Type': DEFAULT_CONTENT_TYPE,
    'Authorization': DEFAULT_AUTH_TOKEN,
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

@Injectable({providedIn: 'root'})
export class AuthServerProvider {

    private updateTokenTimer: any;

    constructor(
        private principal: Principal,
        private http: HttpClient,
        private sessionService: XmSessionService,
        private $localStorage: LocalStorageService,
        private $sessionStorage: SessionStorageService,
        private stateStorageService: StateStorageService,
        private router: Router,
    ) {
        const isRememberMe = this.$localStorage.retrieve(REFRESH_TOKEN) != null;
        this.setAutoRefreshTokens(isRememberMe);
    }

    public getToken(): any {
        return this.$localStorage.retrieve(AUTH_TOKEN) || this.$sessionStorage.retrieve(AUTH_TOKEN);
    }

    public getRefreshToken(): any {
        return this.$localStorage.retrieve(REFRESH_TOKEN) || this.$sessionStorage.retrieve(REFRESH_TOKEN);
    }

    public acceptTermsAndConditions(tocOneTimeToken: string): Observable<any> {
        const headers = {
            'Authorization': DEFAULT_AUTH_TOKEN,
            'Content-Type': DEFAULT_CONTENT_TYPE,
            'Accept': 'application/json',
        };
        return this.http
            .post(`/uaa/api/users/accept-terms-of-conditions/${tocOneTimeToken}`, {}, {headers});
    }

    public login(credentials: any): Observable<any> {
        let data = new HttpParams({encoder: new CustomUriEncoder()});
        this.$sessionStorage.clear(WIDGET_DATA);

        if (credentials && !credentials.grant_type) {
            data = data.append('grant_type', 'password');
            data = data.append('username', credentials.username);
            data = data.append('password', credentials.password);
        } else {
            data = data.append('grant_type', credentials.grant_type);
            if (credentials.grant_type === 'tfa_otp_token') {
                data = data.append('otp', credentials.otp);
                data = data.append('tfa_access_token_type', 'bearer');
                data = data.append('tfa_access_token', this.getToken());
            } else {
                data = data.append('username', credentials.username);
                data = data.append('password', credentials.password);
            }
        }

        return this.getAccessToken(data, DEFAULT_HEADERS, credentials.rememberMe).pipe(
            tap(() => this.sessionService.create()),
        );
    }

    public loginWithToken(jwt: string, rememberMe: boolean): Promise<never> | Promise<unknown> {
        this.$sessionStorage.clear(WIDGET_DATA);
        if (jwt) {
            this.storeAuthenticationToken(jwt, rememberMe);
            return Promise.resolve(jwt);
        } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
        }
    }

    public storeAuthenticationToken(jwt: string, rememberMe: boolean): void {
        if (rememberMe) {
            this.$localStorage.store(AUTH_TOKEN, jwt);
            this.$sessionStorage.store(AUTH_TOKEN, jwt);
        } else {
            this.$sessionStorage.store(AUTH_TOKEN, jwt);
        }
    }

    public storeRefreshToken(jwt: string, rememberMe: boolean): void {
        if (rememberMe) {
            this.$localStorage.store(REFRESH_TOKEN, jwt);
            this.$sessionStorage.store(REFRESH_TOKEN, jwt);
        } else {
            this.$sessionStorage.store(REFRESH_TOKEN, jwt);
        }
    }

    public logout(): Observable<any> {
        return new Observable((observer) => {
            this.$localStorage.clear(AUTH_TOKEN);
            this.$sessionStorage.clear(AUTH_TOKEN);
            this.$localStorage.clear(REFRESH_TOKEN);
            this.$sessionStorage.clear(REFRESH_TOKEN);
            this.$sessionStorage.clear(TOKEN_STORAGE_KEY);
            this.$localStorage.clear(EXPIRES_DATE_FIELD);
            this.$sessionStorage.clear(EXPIRES_DATE_FIELD);
            this.$sessionStorage.clear(WIDGET_DATA);
            clearTimeout(this.updateTokenTimer);
            observer.next();
            observer.complete();
        }).pipe(
            tap(() => this.sessionService.clear()),
        );
    }

    private storeAT(resp: any, rememberMe: boolean): string {
        const accessToken = resp[ACCESS_TOKEN];
        if (accessToken) {
            this.storeAuthenticationToken(accessToken, rememberMe);
        }
        return accessToken;
    }

    private storeRT(resp: any, rememberMe: boolean): void {
        const refreshToken = resp[REFRESH_TOKEN];
        if (refreshToken) {
            const authenticationTokenexpiresDate = new Date().setSeconds(resp.expires_in);
            this.$sessionStorage.store(EXPIRES_DATE_FIELD, authenticationTokenexpiresDate);
            this.storeRefreshToken(refreshToken, rememberMe);
            this.updateTokenTimer = setTimeout(() => {
                this.refreshTokens(rememberMe);
            }, (resp.expires_in - 60) * 1000);
        } else {
            console.info('Expected to get %s but got undefined', REFRESH_TOKEN); // tslint:disable-line
        }
    }

    private getAccessToken(data: any, headers: any, rememberMe: boolean): Observable<any> {
        return this.http.post<any>(TOKEN_URL, data, {headers, observe: 'response'}).pipe(map((resp) => {
            this.$sessionStorage.clear(TOKEN_STORAGE_KEY);
            const result = resp.body;
            let accessToken;
            let tfaChannel = '';

            if (resp.headers.get('icthh-xm-tfa-otp') === 'required') {
                tfaChannel = resp.headers.get('icthh-xm-tfa-otp-channel');
                console.info('tfaRequired=%s using %s', true, tfaChannel);

                this.stateStorageService.storeDestinationState(
                    {
                        name: 'otpConfirmation',
                        data: {tfaVerificationKey: result.tfaVerificationKey, tfaChannel},
                    },
                    {},
                    {name: 'login'});

                accessToken = this.storeAT(result, rememberMe);
            } else {
                this.stateStorageService.resetDestinationState();
                accessToken = this.storeAT(result, rememberMe);
                this.storeRT(result, rememberMe);
            }

            return accessToken;

        }));
    }

    private refreshTokens(rememberMe: boolean): void {
        const headers = {
            'Authorization': DEFAULT_AUTH_TOKEN,
            'Content-Type': DEFAULT_CONTENT_TYPE,
            'Accept': 'application/json',
        };

        const body = new HttpParams()
            .set('grant_type', 'refresh_token')
            .set('refresh_token', this.getRefreshToken());

        this.http.post<any>(TOKEN_URL, body, {headers, observe: 'response'})
            .pipe(map((resp) => resp.body))
            .subscribe((data) => {
                this.storeAT(data, rememberMe);
                this.storeRT(data, rememberMe);
                this.sessionService.update();
            }, (error) => {
                console.info('Refresh token fails: %o', error); // tslint:disable-line
                this.logout().subscribe();
                this.principal.logout();
                this.router.navigate(['']);
                this.sessionService.clear();
            });

    }

    private setAutoRefreshTokens(rememberMe: boolean): void {
        if (this.getRefreshToken()) {
            const currentDate = new Date().setSeconds(0);
            const expiresdate = this.$sessionStorage.retrieve(EXPIRES_DATE_FIELD);
            if (currentDate < expiresdate) {
                const expiresIn = (expiresdate - currentDate) / 1000 - 30;
                this.updateTokenTimer = setTimeout(() => {
                    if (this.getRefreshToken()) {
                        this.refreshTokens(rememberMe);
                    }
                }, expiresIn * 1000);
                this.sessionService.create();
            } else {
                this.refreshTokens(rememberMe);
            }
        }
    }
}
