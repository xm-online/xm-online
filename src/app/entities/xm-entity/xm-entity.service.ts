import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { XmEntity } from './xm-entity.model';
import { DateUtils } from 'ng-jhipster';
@Injectable()
export class XmEntityService {

    private resourceUrl = 'entity/api/xm-entities';
    private resourceSearchUrl = 'entity/api/_search/xm-entities';
    private avatarUrl = 'entity/api/storage/objects';

    static toDateString(date: Date): string {
        if (!date) {
            return null;
        }
        return (date.getFullYear().toString() + '-'
            + ('0' + (date.getMonth() + 1)).slice(-2) + '-'
            + ('0' + (date.getDate())).slice(-2))
            + 'T' + date.toTimeString().slice(0, 5);
    }

    constructor(private http: Http, private dateUtils: DateUtils) { }

    create(xmEntity: XmEntity): Observable<XmEntity> {
        const copy: XmEntity = Object.assign({}, xmEntity);
        copy.startDate = this.dateUtils.toDate(xmEntity.startDate);
        copy.updateDate = this.dateUtils.toDate(xmEntity.updateDate);
        copy.endDate = this.dateUtils.toDate(xmEntity.endDate);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(xmEntity: XmEntity): Observable<XmEntity> {
        const copy: XmEntity = Object.assign({}, xmEntity);

        copy.startDate = xmEntity.startDate instanceof Date ? xmEntity.startDate : this.dateUtils.toDate(xmEntity.startDate);
        copy.updateDate = xmEntity.updateDate instanceof Date ? xmEntity.updateDate : this.dateUtils.toDate(xmEntity.updateDate);
        copy.endDate = xmEntity.endDate instanceof Date ? xmEntity.endDate : this.dateUtils.toDate(xmEntity.endDate);

        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number, embed?: string[]): Observable<XmEntity> {
        return this.http.get(`${this.resourceUrl}/${id}`, {
            params: {
                embed: embed
            }
        }).map((res: Response) => {
            const jsonResponse = res.json();
            jsonResponse.startDate = this.dateUtils
                .convertDateTimeFromServer(jsonResponse.startDate);
            jsonResponse.updateDate = this.dateUtils
                .convertDateTimeFromServer(jsonResponse.updateDate);
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

    changeState(id: number, stateKey: string): Observable<Response> {
        return this.http.put(`${this.resourceUrl}/${id}/states/${stateKey}`, {}).map((res: Response) => {
            return res.json();
        });
    }

    search(req?: any): Observable<Response> {
        const options = this.createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res))
        ;
    }

    searchByTypeKeyAndQuery(req?: any): Observable<Response> {
        const options = this.createRequestOption(req);
        return this.http.get("entity/api/_search-with-typekey/xm-entities", options)
            .map((res: any) => this.convertResponse(res));
    }

    uploadAvatar(xmEntity: XmEntity, file: File): Observable<String> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(this.avatarUrl, formData).map((res: Response) => {
            this.find(xmEntity.id).subscribe((xmEntityActual) => {
                xmEntityActual.avatarUrl = res.text();
                xmEntityActual.startDate = XmEntityService.toDateString(xmEntityActual.startDate);
                xmEntityActual.endDate = XmEntityService.toDateString(xmEntityActual.endDate);
                xmEntityActual.updateDate = XmEntityService.toDateString(xmEntityActual.updateDate);
                this.update(xmEntityActual).subscribe((response) => {
                    console.log('Avatar updated.');
                });
            });
            return res.text();
        });
    }

    private convertResponse(res: any): any {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            jsonResponse[i].startDate = this.dateUtils
                .convertDateTimeFromServer(jsonResponse[i].startDate);
            jsonResponse[i].updateDate = this.dateUtils
                .convertDateTimeFromServer(jsonResponse[i].updateDate);
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
            if (req.typeKey) {
                params.set('typeKey', req.typeKey);
            }
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
