import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_API_URL } from '../../xm.constants';
import { Comment } from './comment.model';

@Injectable()
export class CommentService {

    private resourceUrl = SERVER_API_URL + 'entity/api/comments';
    private resourceSearchUrl = SERVER_API_URL + 'entity/api/_search/comments';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    create(comment: Comment): Observable<HttpResponse<Comment>> {
        const copy = this.convert(comment);
        return this.http.post<Comment>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Comment>) => this.convertResponse(res)));
    }

    update(comment: Comment): Observable<HttpResponse<Comment>> {
        const copy = this.convert(comment);
        return this.http.put<Comment>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Comment>) => this.convertResponse(res)));
    }

    find(id: number): Observable<HttpResponse<Comment>> {
        return this.http.get<Comment>(`${this.resourceUrl}/${id}`, {observe: 'response'}).pipe(
            map((res: HttpResponse<Comment>) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Comment[]>> {
        const options = createRequestOption(req);
        return this.http.get<Comment[]>(this.resourceUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Comment[]>) => this.convertArrayResponse(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Comment[]>> {
        const options = createRequestOption(req);
        return this.http.get<Comment[]>(this.resourceSearchUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Comment[]>) => this.convertArrayResponse(res)));
    }

    private convertResponse(res: HttpResponse<Comment>): HttpResponse<Comment> {
        const body: Comment = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Comment[]>): HttpResponse<Comment[]> {
        const jsonResponse: Comment[] = res.body;
        const body: Comment[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Comment.
     */
    private convertItemFromServer(comment: Comment): Comment {
        const copy: Comment = Object.assign({}, comment);
        copy.entryDate = this.dateUtils
            .convertDateTimeFromServer(comment.entryDate);
        return copy;
    }

    /**
     * Convert a Comment to a JSON which can be sent to the server.
     */
    private convert(comment: Comment): Comment {
        const copy: Comment = Object.assign({}, comment);

        copy.entryDate = this.dateUtils.toDate(comment.entryDate);
        return copy;
    }
}
