import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { createRequestOption } from '../../shared';
import { SERVER_API_URL } from '../../xm.constants';
import { Audit } from './audit.model';

@Injectable()
export class AuditsService {
    constructor(private http: HttpClient) {
    }

    query(req: any): Observable<HttpResponse<Audit[]>> {
        const params: HttpParams = createRequestOption(req);
        params.set('fromDate', req.fromDate);
        params.set('toDate', req.toDate);

        const requestURL = SERVER_API_URL + 'uaa/management/audits';

        return this.http.get<Audit[]>(requestURL, {
            params,
            observe: 'response'
        });
    }
}
