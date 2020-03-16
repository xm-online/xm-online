import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createRequestOption } from './request-util';
import { SERVER_API_URL } from '../../xm.constants';
import { Tag } from './tag.model';

@Injectable()
export class TagService {

    private resourceUrl: string = SERVER_API_URL + 'entity/api/tags';
    private resourceSearchUrl: string = SERVER_API_URL + 'entity/api/_search/tags';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    public create(tag: Tag): Observable<HttpResponse<Tag>> {
        const copy = this.convert(tag);
        return this.http.post<Tag>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Tag>) => this.convertResponse(res)));
    }

    public update(tag: Tag): Observable<HttpResponse<Tag>> {
        const copy = this.convert(tag);
        return this.http.put<Tag>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Tag>) => this.convertResponse(res)));
    }

    public find(id: number): Observable<HttpResponse<Tag>> {
        return this.http.get<Tag>(`${this.resourceUrl}/${id}`, {observe: 'response'}).pipe(
            map((res: HttpResponse<Tag>) => this.convertResponse(res)));
    }

    public query(req?: any): Observable<HttpResponse<Tag[]>> {
        const options = createRequestOption(req);
        return this.http.get<Tag[]>(this.resourceUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Tag[]>) => this.convertArrayResponse(res)));
    }

    public delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    public search(req?: any): Observable<HttpResponse<Tag[]>> {
        const options = createRequestOption(req);
        return this.http.get<Tag[]>(this.resourceSearchUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Tag[]>) => this.convertArrayResponse(res)));
    }

    private convertResponse(res: HttpResponse<Tag>): HttpResponse<Tag> {
        const body: Tag = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Tag[]>): HttpResponse<Tag[]> {
        const jsonResponse: Tag[] = res.body;
        const body: Tag[] = [];
        for (const i of jsonResponse) {
            body.push(this.convertItemFromServer(i));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Tag.
     */
    private convertItemFromServer(tag: Tag): Tag {
        const copy: Tag = Object.assign({}, tag);
        copy.startDate = this.dateUtils
            .convertDateTimeFromServer(tag.startDate);
        return copy;
    }

    /**
     * Convert a Tag to a JSON which can be sent to the server.
     */
    private convert(tag: Tag): Tag {
        const copy: Tag = Object.assign({}, tag);

        copy.startDate = this.dateUtils.toDate(tag.startDate);
        return copy;
    }
}
