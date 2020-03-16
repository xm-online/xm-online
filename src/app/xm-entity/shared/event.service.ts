import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createRequestOption } from './request-util';
import { SERVER_API_URL } from '../../xm.constants';
import { Event } from './event.model';

@Injectable()
export class EventService {

    private resourceUrl: string = SERVER_API_URL + 'entity/api/events';
    private resourceSearchUrl: string = SERVER_API_URL + 'entity/api/_search/events';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    public create(event: Event): Observable<HttpResponse<Event>> {
        const copy = this.convert(event);
        return this.http.post<Event>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Event>) => this.convertResponse(res)));
    }

    public update(event: Event): Observable<HttpResponse<Event>> {
        const copy = this.convert(event);
        return this.http.put<Event>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Event>) => this.convertResponse(res)));
    }

    public find(id: number): Observable<HttpResponse<Event>> {
        return this.http.get<Event>(`${this.resourceUrl}/${id}`, {observe: 'response'}).pipe(
            map((res: HttpResponse<Event>) => this.convertResponse(res)));
    }

    public query(req?: any): Observable<HttpResponse<Event[]>> {
        const options = createRequestOption(req);
        return this.http.get<Event[]>(this.resourceUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Event[]>) => this.convertArrayResponse(res)));
    }

    public delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    public search(req?: any): Observable<HttpResponse<Event[]>> {
        const options = createRequestOption(req);
        return this.http.get<Event[]>(this.resourceSearchUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Event[]>) => this.convertArrayResponse(res)));
    }

    private convertResponse(res: HttpResponse<Event>): HttpResponse<Event> {
        const body: Event = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Event[]>): HttpResponse<Event[]> {
        const jsonResponse: Event[] = res.body;
        const body: Event[] = [];
        for (const i of jsonResponse) {
            body.push(this.convertItemFromServer(i));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Event.
     */
    private convertItemFromServer(event: Event): Event {
        const copy: Event = Object.assign({}, event);
        copy.startDate = this.dateUtils
            .convertDateTimeFromServer(event.startDate);
        copy.endDate = this.dateUtils
            .convertDateTimeFromServer(event.endDate);
        return copy;
    }

    /**
     * Convert a Event to a JSON which can be sent to the server.
     */
    private convert(event: Event): Event {
        const copy: Event = Object.assign({}, event);

        copy.startDate = this.dateUtils.toDate(event.startDate);

        copy.endDate = this.dateUtils.toDate(event.endDate);
        return copy;
    }
}
