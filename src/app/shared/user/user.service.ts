import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from './user.model';

@Injectable()
export class UserService {
    private resourceUrl: string = 'uaa/api/users';
    private resurceUrlByLogin: string = this.resourceUrl + '/logins-contains';

    constructor(private http: HttpClient) { }

    public create(user: User): Observable<HttpResponse<any>> {
        return this.http.post(this.resourceUrl, user, {observe: 'response'});
    }

    public update(user: User): Observable<HttpResponse<any>> {
        console.info(user);
        return this.http.put(this.resourceUrl, user, {observe: 'response'});
    }

    public enable2FA(userKey: string, email: string): Observable<HttpResponse<any>> {
        return this.http.post(`${this.resourceUrl}/${userKey}/tfa_enable`, {
            otpChannelSpec: {
                channelType: 'email',
                destination: email,
            },
        }, {observe: 'response'});
    }

    public disable2FA(userKey: string): Observable<HttpResponse<any>> {
        return this.http.post(`${this.resourceUrl}/${userKey}/tfa_disable`, {}, {observe: 'response'});
    }

    public find(userKey: string): Observable<User> {
        return this.http.get<User>(`${this.resourceUrl}/${userKey}`);
    }

    public loginContains(req: any): Observable<any> {
        let params = new HttpParams();
        if (req) {
            params = params.set('page', req.page);
            params = params.set('size', req.size);
            if (req.sort) {
                req.sort.forEach((val) => {
                    params = params.append('sort', val);
                });
            }
            if (req.login) {
                params = params.set('login', req.login);
            }
        }

        return this.http.get(this.resurceUrlByLogin, {params, observe: 'response'});
    }

    public findPublic(userKey: string): Observable<any> {
        return this.http.get<any>(`${this.resourceUrl}/${userKey}/public`);
    }

    public findByLogin(login: string): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.set('login', login);
        return this.http.get(`${this.resourceUrl}/logins`, {params, observe: 'response'});
    }

    public query(req?: any): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        if (req) {
            params = params.set('page', req.page);
            params = params.set('size', req.size);
            if (req.sort) {
                req.sort.forEach((val) => {
                    params = params.append('sort', val);
                });
            }
            if (req.roleKey) {
                params = params.set('roleKey', req.roleKey);
            }
        }

        return this.http.get(this.resourceUrl, {params, observe: 'response'});
    }

    public delete(userKey: string): Observable<HttpResponse<any>> {
        return this.http.delete(`${this.resourceUrl}/${userKey}`, {observe: 'response'});
    }

    public updateLogins(user: User): Observable<HttpResponse<any>> {
        return this.http.put(`${this.resourceUrl}/logins`, user, {observe: 'response'});
    }

    public getOnlineUsers(): Observable<HttpResponse<any>> {
        return this.http.get('uaa/api/onlineUsers', {observe: 'response'});
    }
}
