import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class RegisterService {

    constructor(private http: Http) {}

    save(account: any): Observable<any> {
        return this.http.post('uaa/api/register', account);
    }

    isCaptchaNeed(): Observable<any> {
        return this.http.get('uaa/api/is-captcha-need');
    }


}
