import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_API_URL } from '../../xm.constants';
import { Content } from './content.model';

@Injectable()
export class ContentService {

    private resourceUrl: string = SERVER_API_URL + 'entity/api/contents';

    constructor(private http: HttpClient) {
    }

    public create(content: Content): Observable<HttpResponse<Content>> {
        const copy = this.convert(content);
        return this.http.post<Content>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Content>) => this.convertResponse(res)));
    }

    public update(content: Content): Observable<HttpResponse<Content>> {
        const copy = this.convert(content);
        return this.http.put<Content>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Content>) => this.convertResponse(res)));
    }

    public find(id: number): Observable<HttpResponse<Content>> {
        return this.http.get<Content>(`${this.resourceUrl}/${id}`, {observe: 'response'}).pipe(
            map((res: HttpResponse<Content>) => this.convertResponse(res)));
    }

    public query(req?: any): Observable<HttpResponse<Content[]>> {
        const options = createRequestOption(req);
        return this.http.get<Content[]>(this.resourceUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Content[]>) => this.convertArrayResponse(res)));
    }

    public delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: HttpResponse<Content>): HttpResponse<Content> {
        const body: Content = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Content[]>): HttpResponse<Content[]> {
        const jsonResponse: Content[] = res.body;
        const body: Content[] = [];
        for (const i of jsonResponse) {
            body.push(this.convertItemFromServer(i));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Content.
     */
    private convertItemFromServer(content: Content): Content {
        return Object.assign({}, content);
    }

    /**
     * Convert a Content to a JSON which can be sent to the server.
     */
    private convert(content: Content): Content {
        return Object.assign({}, content);
    }
}
