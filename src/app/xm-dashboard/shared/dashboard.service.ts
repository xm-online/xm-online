import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createRequestOption } from '../../shared';
import { SERVER_API_URL } from '../../xm.constants';
import { Dashboard } from './dashboard.model';

@Injectable()
export class DashboardService {

    private resourceUrl = SERVER_API_URL + 'dashboard/api/dashboards';

    constructor(private http: HttpClient) {
    }

    create(dashboard: Dashboard): Observable<HttpResponse<Dashboard>> {
        const copy = this.convert(dashboard);
        return this.http.post<Dashboard>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Dashboard>) => this.convertResponse(res)));
    }

    update(dashboard: Dashboard): Observable<HttpResponse<Dashboard>> {
        const copy = this.convert(dashboard);
        return this.http.put<Dashboard>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Dashboard>) => this.convertResponse(res)));
    }

    find(id: number): Observable<HttpResponse<Dashboard>> {
        return this.http.get<Dashboard>(`${this.resourceUrl}/${id}`, {observe: 'response'}).pipe(
            map((res: HttpResponse<Dashboard>) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Dashboard[]>> {
        const options = createRequestOption(req);
        return this.http.get<Dashboard[]>(this.resourceUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Dashboard[]>) => this.convertArrayResponse(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: HttpResponse<Dashboard>): HttpResponse<Dashboard> {
        const body: Dashboard = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Dashboard[]>): HttpResponse<Dashboard[]> {
        const jsonResponse: Dashboard[] = res.body;
        const body: Dashboard[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Dashboard.
     */
    private convertItemFromServer(dashboard: Dashboard): Dashboard {
        const copy: Dashboard = Object.assign({}, dashboard);
        return copy;
    }

    /**
     * Convert a Dashboard to a JSON which can be sent to the server.
     */
    private convert(dashboard: Dashboard): Dashboard {
        const copy: Dashboard = Object.assign({}, dashboard);
        return copy;
    }
}
