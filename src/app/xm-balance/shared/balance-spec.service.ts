import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '../../xm.constants';
import { Spec } from './spec.model';

@Injectable()
export class BalanceSpecService {

    private resourceUrl = SERVER_API_URL + 'config/api/profile/balance/balancespec.yml?toJson';

    constructor(private http: HttpClient) {
    }

    get(): Observable<HttpResponse<Spec>> {
        return this.http.get<Spec>(this.resourceUrl, {observe: 'response'});
    }

}
