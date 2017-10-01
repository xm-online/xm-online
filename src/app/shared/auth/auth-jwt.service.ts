import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';

@Injectable()
export class AuthServerProvider {
    constructor(
        private http: Http,
        private $localStorage: LocalStorageService,
        private $sessionStorage: SessionStorageService
    ) {}

    getToken() {
        return this.$localStorage.retrieve('authenticationToken') || this.$sessionStorage.retrieve('authenticationToken');
    }

    login(credentials): Observable<any> {
        const data = new URLSearchParams();
        data.append('grant_type', 'password');
        data.append('username', credentials.username);
        data.append('password', credentials.password);

        const headers = new Headers ({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization' : 'Basic d2ViX2FwcDo='
        });

        return this.http.post('uaa/oauth/token', data, {
            headers
        }).map((resp) => {
            const accessToken = resp.json()['access_token'];
            if (accessToken) {
                this.storeAuthenticationToken(accessToken, credentials.rememberMe);
            }
            const refreshToken = resp.json()['refresh_token'];
            if (refreshToken) {
                this.storeRefreshToken(refreshToken, credentials.rememberMe);
            }

            return accessToken;
        });
    }

    loginWithToken(jwt, rememberMe) {
        if (jwt) {
            this.storeAuthenticationToken(jwt, rememberMe);
            return Promise.resolve(jwt);
        } else {
            return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
        }
    }

    storeAuthenticationToken(jwt, rememberMe) {
        if (rememberMe) {
            this.$localStorage.store('authenticationToken', jwt);
        } else {
            this.$sessionStorage.store('authenticationToken', jwt);
        }
    }

    storeRefreshToken(jwt, rememberMe) {
        if (rememberMe) {
            this.$localStorage.store('refreshToken', jwt);
        } else {
            this.$sessionStorage.store('refreshToken', jwt);
        }
    }

    logout(): Observable<any> {
        return new Observable(observer => {
            this.$localStorage.clear('authenticationToken');
            this.$sessionStorage.clear('authenticationToken');
            this.$localStorage.clear('refreshToken');
            this.$sessionStorage.clear('refreshToken');
            observer.complete();
        });
    }
}
