import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createRequestOption } from './request-util';
import { SERVER_API_URL } from '../../xm.constants';
import { Link } from './link.model';

@Injectable()
export class LinkService {

    private resourceUrl: string = SERVER_API_URL + 'entity/api/links';
    private resourceSearchUrl: string = SERVER_API_URL + 'entity/api/_search/links';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    public create(link: Link): Observable<HttpResponse<Link>> {
        const copy = this.convert(link);
        return this.http.post<Link>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Link>) => this.convertResponse(res)));
    }

    public update(link: Link): Observable<HttpResponse<Link>> {
        const copy = this.convert(link);
        return this.http.put<Link>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Link>) => this.convertResponse(res)));
    }

    public find(id: number): Observable<HttpResponse<Link>> {
        return this.http.get<Link>(`${this.resourceUrl}/${id}`, {observe: 'response'}).pipe(
            map((res: HttpResponse<Link>) => this.convertResponse(res)));
    }

    public query(req?: any): Observable<HttpResponse<Link[]>> {
        const options = createRequestOption(req);
        return this.http.get<Link[]>(this.resourceUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Link[]>) => this.convertArrayResponse(res)));
    }

    public delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    public search(req?: any): Observable<HttpResponse<Link[]>> {
        const options = createRequestOption(req);
        return this.http.get<Link[]>(this.resourceSearchUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Link[]>) => this.convertArrayResponse(res)));
    }

    private convertResponse(res: HttpResponse<Link>): HttpResponse<Link> {
        const body: Link = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Link[]>): HttpResponse<Link[]> {
        const jsonResponse: Link[] = res.body;
        const body: Link[] = [];
        for (const i of jsonResponse) {
            body.push(this.convertItemFromServer(i));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Link.
     */
    private convertItemFromServer(link: Link): Link {
        const copy: Link = Object.assign({}, link);
        copy.startDate = this.dateUtils
            .convertDateTimeFromServer(link.startDate);
        copy.endDate = this.dateUtils
            .convertDateTimeFromServer(link.endDate);
        return copy;
    }

    /**
     * Convert a Link to a JSON which can be sent to the server.
     */
    private convert(link: Link): Link {
        const copy: Link = Object.assign({}, link);

        copy.startDate = this.dateUtils.toDate(link.startDate);

        copy.endDate = this.dateUtils.toDate(link.endDate);
        return copy;
    }
}
