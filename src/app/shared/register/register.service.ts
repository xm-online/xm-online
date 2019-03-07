import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class RegisterService {

    constructor(private http: HttpClient) {}

    save(account: any): Observable<any> {
        return this.http.post('uaa/api/register', account);
    }

    isCaptchaNeed(): Observable<any> {
        return this.http.get('uaa/api/is-captcha-need');
    }


}
