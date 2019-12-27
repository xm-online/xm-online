import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createRequestOption } from '../../shared';
import { SERVER_API_URL } from '../../xm.constants';
import { Metric } from './metric.model';

@Injectable()
export class MetricService {

    private resourceUrl: string = SERVER_API_URL + 'balance/api/metrics';

    constructor(private http: HttpClient) { }

    public create(metric: Metric): Observable<HttpResponse<Metric>> {
        const copy = this.convert(metric);
        return this.http.post<Metric>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Metric>) => this.convertResponse(res)));
    }

    public update(metric: Metric): Observable<HttpResponse<Metric>> {
        const copy = this.convert(metric);
        return this.http.put<Metric>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Metric>) => this.convertResponse(res)));
    }

    public find(id: number): Observable<HttpResponse<Metric>> {
        return this.http.get<Metric>(`${this.resourceUrl}/${id}`, {observe: 'response'}).pipe(
            map((res: HttpResponse<Metric>) => this.convertResponse(res)));
    }

    public query(req?: any): Observable<HttpResponse<Metric[]>> {
        const options = createRequestOption(req);
        return this.http.get<Metric[]>(this.resourceUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Metric[]>) => this.convertArrayResponse(res)));
    }

    public delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: HttpResponse<Metric>): HttpResponse<Metric> {
        const body: Metric = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Metric[]>): HttpResponse<Metric[]> {
        const jsonResponse: Metric[] = res.body;
        const body: Metric[] = [];
        for (const i of jsonResponse) {
            body.push(this.convertItemFromServer(i));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Metric.
     */
    private convertItemFromServer(metric: Metric): Metric {
        return Object.assign({}, metric);
    }

    /**
     * Convert a Metric to a JSON which can be sent to the server.
     */
    private convert(metric: Metric): Metric {
        return Object.assign({}, metric);
    }
}
