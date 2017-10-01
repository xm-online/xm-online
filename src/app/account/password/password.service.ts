import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {ChangePassword} from './password.model';

@Injectable()
export class Password {

    constructor(private http: Http) {}

    save(password: ChangePassword): Observable<any> {
        return this.http.post('uaa/api/account/change_password', password);
    }
}
