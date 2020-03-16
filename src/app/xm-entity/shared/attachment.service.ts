import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createRequestOption } from './request-util';
import { SERVER_API_URL } from '../../xm.constants';
import { Attachment } from './attachment.model';

@Injectable()
export class AttachmentService {

    private resourceUrl: string = SERVER_API_URL + 'entity/api/attachments';
    private resourceSearchUrl: string = SERVER_API_URL + 'entity/api/_search/attachments';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    public create(attachment: Attachment): Observable<HttpResponse<Attachment>> {
        const copy = this.convert(attachment);
        return this.http.post<Attachment>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Attachment>) => this.convertResponse(res)));
    }

    public update(attachment: Attachment): Observable<HttpResponse<Attachment>> {
        const copy = this.convert(attachment);
        return this.http.put<Attachment>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Attachment>) => this.convertResponse(res)));
    }

    public find(id: number): Observable<HttpResponse<Attachment>> {
        return this.http.get<Attachment>(`${this.resourceUrl}/${id}`, {observe: 'response'}).pipe(
            map((res: HttpResponse<Attachment>) => this.convertResponse(res)));
    }

    public query(req?: any): Observable<HttpResponse<Attachment[]>> {
        const options = createRequestOption(req);
        return this.http.get<Attachment[]>(this.resourceUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Attachment[]>) => this.convertArrayResponse(res)));
    }

    public delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    public search(req?: any): Observable<HttpResponse<Attachment[]>> {
        const options = createRequestOption(req);
        return this.http.get<Attachment[]>(this.resourceSearchUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Attachment[]>) => this.convertArrayResponse(res)));
    }

    private convertResponse(res: HttpResponse<Attachment>): HttpResponse<Attachment> {
        const body: Attachment = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Attachment[]>): HttpResponse<Attachment[]> {
        const jsonResponse: Attachment[] = res.body;
        const body: Attachment[] = [];
        for (const i of jsonResponse) {
            body.push(this.convertItemFromServer(i));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Attachment.
     */
    private convertItemFromServer(attachment: Attachment): Attachment {
        const copy: Attachment = Object.assign({}, attachment);
        copy.startDate = this.dateUtils
            .convertDateTimeFromServer(attachment.startDate);
        copy.endDate = this.dateUtils
            .convertDateTimeFromServer(attachment.endDate);
        return copy;
    }

    /**
     * Convert a Attachment to a JSON which can be sent to the server.
     */
    private convert(attachment: Attachment): Attachment {
        const copy: Attachment = Object.assign({}, attachment);

        copy.startDate = this.dateUtils.toDate(attachment.startDate);

        copy.endDate = this.dateUtils.toDate(attachment.endDate);
        return copy;
    }
}
