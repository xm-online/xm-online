import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Attachment } from './attachment.model';
import { DateUtils } from 'ng-jhipster';
@Injectable()
export class AttachmentService {

    private resourceUrl = 'entity/api/attachments';
    private resourceSearchUrl = 'entity/api/_search/attachments';

    constructor(private http: Http, private dateUtils: DateUtils) { }

    create(attachment: Attachment): Observable<Attachment> {
        const copy: Attachment = Object.assign({}, attachment);
        copy.startDate = this.dateUtils.toDate(attachment.startDate);
        copy.endDate = this.dateUtils.toDate(attachment.endDate);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(attachment: Attachment): Observable<Attachment> {
        const copy: Attachment = Object.assign({}, attachment);

        copy.startDate = this.dateUtils.toDate(attachment.startDate);

        copy.endDate = this.dateUtils.toDate(attachment.endDate);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Attachment> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            jsonResponse.startDate = this.dateUtils
                .convertDateTimeFromServer(jsonResponse.startDate);
            jsonResponse.endDate = this.dateUtils
                .convertDateTimeFromServer(jsonResponse.endDate);
            return jsonResponse;
        });
    }

    query(req?: any): Observable<Response> {
        const options = this.createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: any) => this.convertResponse(res))
        ;
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<Response> {
        const options = this.createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res))
        ;
    }


    private convertResponse(res: any): any {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            jsonResponse[i].startDate = this.dateUtils
                .convertDateTimeFromServer(jsonResponse[i].startDate);
            jsonResponse[i].endDate = this.dateUtils
                .convertDateTimeFromServer(jsonResponse[i].endDate);
        }
        res._body = jsonResponse;
        return res;
    }

    private createRequestOption(req?: any): BaseRequestOptions {
        const options: BaseRequestOptions = new BaseRequestOptions();
        if (req) {
            const params: URLSearchParams = new URLSearchParams();
            params.set('page', req.page);
            params.set('size', req.size);
            if (req.sort) {
                params.paramsMap.set('sort', req.sort);
            }
            params.set('query', req.query);

            options.search = params;
        }
        return options;
    }
}
