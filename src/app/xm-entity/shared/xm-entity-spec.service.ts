import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {environment} from '../../../environments/environment';
import { SERVER_API_URL } from '../../xm.constants';
import { XmEntitySpec } from './xm-entity-spec.model';

@Injectable()
export class XmEntitySpecService {

    private resourceUrl: string = SERVER_API_URL + 'entity/api/xm-entity-specs';

    constructor(private http: HttpClient) {
    }

    public get(): Observable<HttpResponse<XmEntitySpec[]>> {
        if (!environment.production) {console.info(`getting ${this.resourceUrl}`); }
        return this.http.get<XmEntitySpec[]>(this.resourceUrl, {observe: 'response'});
    }

    public generateXmEntity(typeKey: string): Observable<HttpResponse<any>> {
        return this.http.post(`${this.resourceUrl}//generate-xm-entity?rootTypeKey=${typeKey}`, null,
            {observe: 'response'});
    }

}
