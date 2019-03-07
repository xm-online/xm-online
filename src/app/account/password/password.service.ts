import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ChangePassword } from './password.model';

@Injectable()
export class Password {

    constructor(private http: HttpClient) {
    }

    save(password: ChangePassword): Observable<any> {
        return this.http.post('uaa/api/account/change_password', password);
    }
}
