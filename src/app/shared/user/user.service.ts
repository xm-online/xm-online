import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { User } from './user.model';

@Injectable()
export class UserService {
    private resourceUrl = 'uaa/api/users';

    constructor(private http: Http) { }

    create(user: User): Observable<Response> {
        return this.http.post(this.resourceUrl, user);
    }

    update(user: User): Observable<Response> {
        return this.http.put(this.resourceUrl, user);
    }

    find(userKey: string): Observable<User> {
        return this.http.get(`${this.resourceUrl}/${userKey}`).map((res: Response) => res.json());
    }

    query(req?: any): Observable<Response> {
        const params: URLSearchParams = new URLSearchParams();
        if (req) {
            params.set('page', req.page);
            params.set('size', req.size);
            if (req.sort) {
                params.paramsMap.set('sort', req.sort);
            }
        }

        const options = {
            search: params
        };

        return this.http.get(this.resourceUrl, options);
    }

    delete(userKey: string): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${userKey}`);
    }

    updateLogins(user: User): Observable<Response> {
        return this.http.put(`${this.resourceUrl}/logins`, user);
    }
}
