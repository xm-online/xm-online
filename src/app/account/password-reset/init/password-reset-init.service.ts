import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
/** @deprecated use AccountService instead */
export class PasswordResetInit {

    constructor(private http: HttpClient) {
    }

    public save(mail: string): Observable<any> {
        return this.http.post('uaa/api/account/reset_password/init', mail);
    }
}
