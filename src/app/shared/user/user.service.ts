import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from './user.model';

@Injectable()
export class UserService {
    private resourceUrl = 'uaa/api/users';

    constructor(private http: HttpClient) { }

    create(user: User): Observable<HttpResponse<any>> {
        return this.http.post(this.resourceUrl, user, {observe: 'response'});
    }

    update(user: User): Observable<HttpResponse<any>> {
        console.log(user);
        return this.http.put(this.resourceUrl, user, {observe: 'response'});
    }

    enable2FA(userKey: string, email: string): Observable<HttpResponse<any>> {
      return this.http.post(`${this.resourceUrl}/${userKey}/tfa_enable`, {
      'otpChannelSpec': {
        'channelType': 'email',
          'destination': email
      }}, {observe: 'response'});
    }

    disable2FA(userKey: string): Observable<HttpResponse<any>> {
      return this.http.post(`${this.resourceUrl}/${userKey}/tfa_disable`, {}, {observe: 'response'});
    }

    find(userKey: string): Observable<User> {
        return this.http.get<User>(`${this.resourceUrl}/${userKey}`);
    }

    findPublic(userKey: string): Observable<any> {
        return this.http.get<any>(`${this.resourceUrl}/${userKey}/public`);
    }

    findByLogin(login: string): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.set('login', login);
        return this.http.get(`${this.resourceUrl}/logins`, {params: params, observe: 'response'});
    }

    query(req?: any): Observable<HttpResponse<any>> {
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

        return this.http.get(this.resourceUrl, {params: params, observe: 'response'});
    }

    delete(userKey: string): Observable<HttpResponse<any>> {
        return this.http.delete(`${this.resourceUrl}/${userKey}`, {observe: 'response'});
    }

    updateLogins(user: User): Observable<HttpResponse<any>> {
        return this.http.put(`${this.resourceUrl}/logins`, user, {observe: 'response'});
    }

    getOnlineUsers(): Observable<HttpResponse<any>> {
        return this.http.get('uaa/api/onlineUsers', {observe: 'response'});
    }
}
