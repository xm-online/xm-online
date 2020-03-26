import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from '../../xm.constants';
import { Link } from './link.model';

import { createRequestOption } from './request-util';
import { XmEntity } from './xm-entity.model';

@Injectable()
export class XmEntityService {

    private v2ResourceUrl: string = SERVER_API_URL + 'entity/api/v2/xm-entities';
    private resourceUrl: string = SERVER_API_URL + 'entity/api/xm-entities';
    private resourceSearchUrl: string = SERVER_API_URL + 'entity/api/_search/xm-entities';
    private resourceAvatarUrl: string = SERVER_API_URL + 'entity/api/storage/objects';
    private resourceProfileUrl: string = SERVER_API_URL + 'entity/api/profile';
    private resourceSearchTemplateUrl: string = SERVER_API_URL + 'entity/api/_search-with-template/xm-entities';
    private getEntitiesByIdUrl: string = `entity/api/xm-entities-by-ids`;

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    public create(xmEntity: XmEntity): Observable<HttpResponse<XmEntity>> {
        const copy = this.convert(xmEntity);
        return this.http.post<XmEntity>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)));
    }

    public update(xmEntity: XmEntity): Observable<HttpResponse<XmEntity>> {
        const copy = this.convert(xmEntity);
        return this.http.put<XmEntity>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)));
    }

    public find(id: number, req?: any): Observable<HttpResponse<XmEntity>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity>(`${this.resourceUrl}/${id}`, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)));
    }

    public getEntitiesByIds(req?: any): Observable<HttpResponse<XmEntity[]>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity[]>(this.getEntitiesByIdUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity[]>) => this.convertArrayResponse(res)));
    }

    public query(req?: any): Observable<HttpResponse<XmEntity[]>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity[]>(this.resourceUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity[]>) => this.convertArrayResponse(res)));
    }

    public delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    public search(req?: any): Observable<HttpResponse<XmEntity[]>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity[]>(this.resourceSearchUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity[]>) => this.convertArrayResponse(res)));
    }

    /**
     *  template  (sting) - a template identifier from the search-templates.yml.
     *  templateParams ([]|{}) - a named parameters for the template.
     */
    public searchByTemplate(req?: any): Observable<HttpResponse<XmEntity[]>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity[]>(this.resourceSearchTemplateUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity[]>) => this.convertArrayResponse(res)));
    }

    public getProfile(req?: any): Observable<HttpResponse<XmEntity>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity>(this.resourceProfileUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)));
    }

    public getProfileByKey(key: string, req?: any): Observable<HttpResponse<XmEntity>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity>(
            `${this.resourceProfileUrl}/${key}`,
            {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)),
        );
    }

    public changeState(id: number, stateKey: string, inputContext?: any): Observable<HttpResponse<XmEntity>> {
        const copy = inputContext ? this.convertFormData(inputContext) : null;
        return this.http.put<XmEntity>(
            `${this.resourceUrl}/${id}/states/${stateKey}`,
            copy,
            {observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)),
        );
    }

    public createAvatar(file: File | Blob): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(this.resourceAvatarUrl, formData, {responseType: 'text'});
    }

    public findLinkTargets(id: number, linkTypeKey: string, req?: any): Observable<HttpResponse<Link[]>> {
        const options = createRequestOption(req);
        return this.http.get<Link[]>(`${this.resourceUrl}/${id}/links/targets?typeKey=${linkTypeKey}`,
            {params: options, observe: 'response'});
    }

    public findLinkSources(id: number, linkTypeKey: string, req?: any): Observable<HttpResponse<Link[]>> {
        const options = createRequestOption(req);
        return this.http.get<Link[]>(`${this.resourceUrl}/${id}/links/sources?typeKey=${linkTypeKey}`,
            {params: options, observe: 'response'});
    }

    public findLinkSourcesInverted(idOrKey: string,
                                   linkTypeKey: string[],
                                   req?: any): Observable<HttpResponse<Link[]>> {
        const options = createRequestOption(req);
        return this.http.get<Link[]>(`${this.v2ResourceUrl}/${idOrKey}/links/sources?typeKeys=${linkTypeKey}`,
            {params: options, observe: 'response'});
    }

    public fileExport(exportType: string, typeKey: string): Observable<Blob> {
        return this.http.get(`${this.resourceUrl}/export/`, {
            responseType: 'blob',
            params: {
                fileFormat: exportType ? exportType : 'csv',
                typeKey,
            },
        });
    }

    private convertResponse(res: HttpResponse<XmEntity>): HttpResponse<XmEntity> {
        const body: XmEntity = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<XmEntity[]>): HttpResponse<XmEntity[]> {
        const jsonResponse: XmEntity[] = res.body;
        const body: XmEntity[] = [];

        for (const i of jsonResponse) {
            body.push(this.convertItemFromServer(i));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to XmEntity.
     */
    private convertItemFromServer(xmEntity: XmEntity): XmEntity {
        const copy: XmEntity = Object.assign({}, xmEntity);
        copy.startDate = this.dateUtils
            .convertDateTimeFromServer(xmEntity.startDate);
        copy.updateDate = this.dateUtils
            .convertDateTimeFromServer(xmEntity.updateDate);
        copy.endDate = this.dateUtils
            .convertDateTimeFromServer(xmEntity.endDate);
        return copy;
    }

    /**
     * Convert a XmEntity to a JSON which can be sent to the server.
     */
    private convert(xmEntity: XmEntity): XmEntity {
        const copy: XmEntity = Object.assign({}, xmEntity);

        copy.startDate = xmEntity.startDate instanceof Date
            ? xmEntity.startDate
            : this.dateUtils.toDate(xmEntity.startDate);

        copy.updateDate = xmEntity.updateDate instanceof Date
            ? xmEntity.updateDate
            : this.dateUtils.toDate(xmEntity.updateDate);

        copy.endDate = xmEntity.endDate instanceof Date ? xmEntity.endDate : this.dateUtils.toDate(xmEntity.endDate);
        return copy;
    }

    /**
     * Convert a InputContext to a JSON which can be sent to the server.
     */
    private convertFormData(inputContext: any): any {
        return Object.assign({}, inputContext);
    }

}
