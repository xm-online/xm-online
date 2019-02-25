import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from '../../xm.constants';
import { Balance } from './balance.model';
import { createRequestOption } from '../../shared';

@Injectable()
export class BalanceService {

    private resourceUrl =  SERVER_API_URL + 'balance/api/balances';

    constructor(private http: HttpClient) { }

    create(balance: Balance): Observable<HttpResponse<Balance>> {
        const copy = this.convert(balance);
        return this.http.post<Balance>(this.resourceUrl, copy, { observe: 'response' }).pipe(
            map((res: HttpResponse<Balance>) => this.convertResponse(res)));
    }

    update(balance: Balance): Observable<HttpResponse<Balance>> {
        const copy = this.convert(balance);
        return this.http.put<Balance>(this.resourceUrl, copy, { observe: 'response' }).pipe(
            map((res: HttpResponse<Balance>) => this.convertResponse(res)));
    }

    find(id: number): Observable<HttpResponse<Balance>> {
        return this.http.get<Balance>(`${this.resourceUrl}/${id}`, { observe: 'response'}).pipe(
            map((res: HttpResponse<Balance>) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Balance[]>> {
        const options = createRequestOption(req);
        return this.http.get<Balance[]>(this.resourceUrl, { params: options, observe: 'response' }).pipe(
            map((res: HttpResponse<Balance[]>) => this.convertArrayResponse(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: HttpResponse<Balance>): HttpResponse<Balance> {
        const body: Balance = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Balance[]>): HttpResponse<Balance[]> {
        const jsonResponse: Balance[] = res.body;
        const body: Balance[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Balance.
     */
    private convertItemFromServer(balance: Balance): Balance {
        const copy: Balance = Object.assign({}, balance);
        return copy;
    }

    /**
     * Convert a Balance to a JSON which can be sent to the server.
     */
    private convert(balance: Balance): Balance {
        const copy: Balance = Object.assign({}, balance);
        return copy;
    }
}
