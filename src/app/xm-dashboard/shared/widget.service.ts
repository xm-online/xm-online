import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from '../../xm.constants';
import { Widget } from './widget.model';
import { createRequestOption } from '../../shared';

@Injectable()
export class WidgetService {

    private resourceUrl =  SERVER_API_URL + 'dashboard/api/widgets';

    constructor(private http: HttpClient) { }

    create(widget: Widget): Observable<HttpResponse<Widget>> {
        const copy = this.convert(widget);
        return this.http.post<Widget>(this.resourceUrl, copy, { observe: 'response' }).pipe(
            map((res: HttpResponse<Widget>) => this.convertResponse(res)));
    }

    update(widget: Widget): Observable<HttpResponse<Widget>> {
        const copy = this.convert(widget);
        return this.http.put<Widget>(this.resourceUrl, copy, { observe: 'response' }).pipe(
            map((res: HttpResponse<Widget>) => this.convertResponse(res)));
    }

    find(id: number): Observable<HttpResponse<Widget>> {
        return this.http.get<Widget>(`${this.resourceUrl}/${id}`, { observe: 'response'}).pipe(
            map((res: HttpResponse<Widget>) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Widget[]>> {
        const options = createRequestOption(req);
        return this.http.get<Widget[]>(this.resourceUrl, { params: options, observe: 'response' }).pipe(
            map((res: HttpResponse<Widget[]>) => this.convertArrayResponse(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: HttpResponse<Widget>): HttpResponse<Widget> {
        const body: Widget = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Widget[]>): HttpResponse<Widget[]> {
        const jsonResponse: Widget[] = res.body;
        const body: Widget[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Widget.
     */
    private convertItemFromServer(widget: Widget): Widget {
        const copy: Widget = Object.assign({}, widget);
        return copy;
    }

    /**
     * Convert a Widget to a JSON which can be sent to the server.
     */
    private convert(widget: Widget): Widget {
        const copy: Widget = Object.assign({}, widget);
        return copy;
    }
}
