import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { DateUtils } from 'ng-jhipster';

import { XmFunction } from './xm-function.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class XmFunctionService {

    private resourceUrl = 'entity/api/xm-functions';
    private resourceSearchUrl = 'entity/api/_search/xm-functions';

    constructor(private http: Http, private dateUtils: DateUtils) { }

    create(xmFunction: XmFunction): Observable<XmFunction> {
        const copy = this.convert(xmFunction);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(xmFunction: XmFunction): Observable<XmFunction> {
        const copy = this.convert(xmFunction);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: number): Observable<XmFunction> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse);
    }

    private convertItemFromServer(entity: any) {
        entity.startDate = this.dateUtils
            .convertDateTimeFromServer(entity.startDate);
        entity.updateDate = this.dateUtils
            .convertDateTimeFromServer(entity.updateDate);
        entity.endDate = this.dateUtils
            .convertDateTimeFromServer(entity.endDate);
    }

    private convert(xmFunction: XmFunction): XmFunction {
        const copy: XmFunction = Object.assign({}, xmFunction);

        copy.startDate = this.dateUtils.toDate(xmFunction.startDate);

        copy.updateDate = this.dateUtils.toDate(xmFunction.updateDate);

        copy.endDate = this.dateUtils.toDate(xmFunction.endDate);
        return copy;
    }
}
