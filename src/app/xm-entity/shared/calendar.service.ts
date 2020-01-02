import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_API_URL } from '../../xm.constants';
import { Calendar } from './calendar.model';

@Injectable()
export class CalendarService {

    private resourceUrl: string = SERVER_API_URL + 'entity/api/calendars';
    private resourceSearchUrl: string = SERVER_API_URL + 'entity/api/_search/calendars';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    public create(calendar: Calendar): Observable<HttpResponse<Calendar>> {
        const copy = this.convert(calendar);
        return this.http.post<Calendar>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Calendar>) => this.convertResponse(res)));
    }

    public update(calendar: Calendar): Observable<HttpResponse<Calendar>> {
        const copy = this.convert(calendar);
        return this.http.put<Calendar>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Calendar>) => this.convertResponse(res)));
    }

    public find(id: number): Observable<HttpResponse<Calendar>> {
        return this.http.get<Calendar>(`${this.resourceUrl}/${id}`, {observe: 'response'}).pipe(
            map((res: HttpResponse<Calendar>) => this.convertResponse(res)));
    }

    public query(req?: any): Observable<HttpResponse<Calendar[]>> {
        const options = createRequestOption(req);
        return this.http.get<Calendar[]>(this.resourceUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Calendar[]>) => this.convertArrayResponse(res)));
    }

    public delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    public search(req?: any): Observable<HttpResponse<Calendar[]>> {
        const options = createRequestOption(req);
        return this.http.get<Calendar[]>(this.resourceSearchUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Calendar[]>) => this.convertArrayResponse(res)));
    }

    private convertResponse(res: HttpResponse<Calendar>): HttpResponse<Calendar> {
        const body: Calendar = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Calendar[]>): HttpResponse<Calendar[]> {
        const jsonResponse: Calendar[] = res.body;
        const body: Calendar[] = [];
        for (const i of jsonResponse) {
            body.push(this.convertItemFromServer(i));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Calendar.
     */
    private convertItemFromServer(calendar: Calendar): Calendar {
        const copy: Calendar = Object.assign({}, calendar);
        copy.startDate = this.dateUtils
            .convertDateTimeFromServer(calendar.startDate);
        copy.endDate = this.dateUtils
            .convertDateTimeFromServer(calendar.endDate);
        return copy;
    }

    /**
     * Convert a Calendar to a JSON which can be sent to the server.
     */
    private convert(calendar: Calendar): Calendar {
        const copy: Calendar = Object.assign({}, calendar);

        copy.startDate = this.dateUtils.toDate(calendar.startDate);

        copy.endDate = this.dateUtils.toDate(calendar.endDate);
        return copy;
    }
}
