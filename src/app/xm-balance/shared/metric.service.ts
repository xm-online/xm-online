import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from '../../xm.constants';
import { Metric } from './metric.model';
import { createRequestOption } from '../../shared';

@Injectable()
export class MetricService {

    private resourceUrl =  SERVER_API_URL + 'balance/api/metrics';

    constructor(private http: HttpClient) { }

    create(metric: Metric): Observable<HttpResponse<Metric>> {
        const copy = this.convert(metric);
        return this.http.post<Metric>(this.resourceUrl, copy, { observe: 'response' }).pipe(
            map((res: HttpResponse<Metric>) => this.convertResponse(res)));
    }

    update(metric: Metric): Observable<HttpResponse<Metric>> {
        const copy = this.convert(metric);
        return this.http.put<Metric>(this.resourceUrl, copy, { observe: 'response' }).pipe(
            map((res: HttpResponse<Metric>) => this.convertResponse(res)));
    }

    find(id: number): Observable<HttpResponse<Metric>> {
        return this.http.get<Metric>(`${this.resourceUrl}/${id}`, { observe: 'response'}).pipe(
            map((res: HttpResponse<Metric>) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Metric[]>> {
        const options = createRequestOption(req);
        return this.http.get<Metric[]>(this.resourceUrl, { params: options, observe: 'response' }).pipe(
            map((res: HttpResponse<Metric[]>) => this.convertArrayResponse(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: HttpResponse<Metric>): HttpResponse<Metric> {
        const body: Metric = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Metric[]>): HttpResponse<Metric[]> {
        const jsonResponse: Metric[] = res.body;
        const body: Metric[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Metric.
     */
    private convertItemFromServer(metric: Metric): Metric {
        const copy: Metric = Object.assign({}, metric);
        return copy;
    }

    /**
     * Convert a Metric to a JSON which can be sent to the server.
     */
    private convert(metric: Metric): Metric {
        const copy: Metric = Object.assign({}, metric);
        return copy;
    }
}
