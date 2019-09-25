import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { XmEntity } from '../../xm-entity/shared/xm-entity.model';
import { SERVER_API_URL } from '../../xm.constants';
import { createRequestOption } from '../model/request-util';
import { ACCOUNT_TFA_DISABLE_URL, ACCOUNT_TFA_ENABLE_URL, ACCOUNT_URL } from './auth.constants';

@Injectable()
export class AccountService {

    private resourceProfileUrl = SERVER_API_URL + 'entity/api/profile';
    private resourceLogins = SERVER_API_URL + 'uaa/api/account/logins';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    get(): Observable<HttpResponse<any>> {
        return this.http.get<Account>(SERVER_API_URL + ACCOUNT_URL, {observe: 'response'});
    }

    save(account: any): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + ACCOUNT_URL, account, {observe: 'response'});
    }

    updateLogins(account: any): Observable<HttpResponse<any>> {
        return this.http.put(this.resourceLogins, account, {observe: 'response'});
    }

    enableTFA(type: string, value: string): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + ACCOUNT_TFA_ENABLE_URL,
            {
                'otpChannelSpec': {
                    'channelType': type,
                    'destination': value
                }
            }, {observe: 'response'});
    }

    disableTFA(): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + ACCOUNT_TFA_DISABLE_URL, {}, {observe: 'response'});
    }

    getProfile(req?: any): Observable<XmEntity> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity>(this.resourceProfileUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)),
            map((res: HttpResponse<XmEntity>) => res.body)
        )
    }

    private convertResponse(res: HttpResponse<XmEntity>): HttpResponse<XmEntity> {
        const body: XmEntity = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to XmEntity.
     */
    private convertItemFromServer(xmEntity: XmEntity): XmEntity {
        const copy: XmEntity = Object.assign({}, xmEntity);
        copy.startDate = this.dateUtils
            .convertDateTimeFromServer(xmEntity.startDate);
        copy.updateDate = this.dateUtils
            .convertDateTimeFromServer(xmEntity.updateDate);
        copy.endDate = this.dateUtils
            .convertDateTimeFromServer(xmEntity.endDate);
        return copy;
    }

}
