import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_API_URL } from '../../xm.constants';
import { Link } from './link.model';
import { XmEntity } from './xm-entity.model';

import { environment } from '../../../environments/environment';

@Injectable()
export class XmEntityService {

    private v2ResourceUrl = SERVER_API_URL + 'entity/api/v2/xm-entities';
    private resourceUrl = SERVER_API_URL + 'entity/api/xm-entities';
    private resourceSearchUrl = SERVER_API_URL + 'entity/api/_search/xm-entities';
    private resourceAvatarUrl = SERVER_API_URL + 'entity/api/storage/objects';
    private resourceProfileUrl = SERVER_API_URL + 'entity/api/profile';
    private resourceSearchTemplateUrl = SERVER_API_URL + 'entity/api/_search-with-template/xm-entities';
    private getEntitiesByIdUrl = `entity/api/xm-entities-by-ids`;

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    create(xmEntity: XmEntity): Observable<HttpResponse<XmEntity>> {
        const copy = this.convert(xmEntity);
        return this.http.post<XmEntity>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)));
    }

    update(xmEntity: XmEntity): Observable<HttpResponse<XmEntity>> {
        const copy = this.convert(xmEntity);
        return this.http.put<XmEntity>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)));
    }

    find(id: number, req?: any): Observable<HttpResponse<XmEntity>> {
        const options = createRequestOption(req);
        if (!environment.production) {
            console.log(`[dbg] find for ${id} with req %o`, req);
        }
        return this.http.get<XmEntity>(`${this.resourceUrl}/${id}`, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)));
    }

    getEntitiesByIds(req?: any): Observable<HttpResponse<XmEntity[]>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity[]>(this.getEntitiesByIdUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity[]>) => this.convertArrayResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<XmEntity[]>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity[]>(this.resourceUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity[]>) => this.convertArrayResponse(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<XmEntity[]>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity[]>(this.resourceSearchUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity[]>) => this.convertArrayResponse(res)));
    }

    /**
     *  template  (sting) - a template identifier from the search-templates.yml.
     *  templateParams ([]|{}) - a named parameters for the template.
     * */
    searchByTemplate(req?: any): Observable<HttpResponse<XmEntity[]>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity[]>(this.resourceSearchTemplateUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity[]>) => this.convertArrayResponse(res)));
    }

    getProfile(req?: any): Observable<HttpResponse<XmEntity>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity>(this.resourceProfileUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)));
    }

    getProfileByKey(key: string, req?: any): Observable<HttpResponse<XmEntity>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity>(`${this.resourceProfileUrl}/${key}`, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)));
    }

    changeState(id: number, stateKey: string, inputContext?: any): Observable<HttpResponse<XmEntity>> {
        const copy = inputContext ? this.convertFormData(inputContext) : null;
        return this.http.put<XmEntity>(`${this.resourceUrl}/${id}/states/${stateKey}`, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)));
    }

    createAvatar(file: File | Blob): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(this.resourceAvatarUrl, formData, {responseType: 'text'});
    }

    findLinkTargets(id: number, linkTypeKey: string, req?: any): Observable<HttpResponse<Link[]>> {
        const options = createRequestOption(req);
        return this.http.get<Link[]>(`${this.resourceUrl}/${id}/links/targets?typeKey=${linkTypeKey}`,
            {params: options, observe: 'response'});
    }

    findLinkSources(id: number, linkTypeKey: string, req?: any): Observable<HttpResponse<Link[]>> {
        const options = createRequestOption(req);
        return this.http.get<Link[]>(`${this.resourceUrl}/${id}/links/sources?typeKey=${linkTypeKey}`,
            {params: options, observe: 'response'});
    }

    findLinkSourcesInverted(idOrKey: string, linkTypeKey: string[], req?: any): Observable<HttpResponse<Link[]>> {
        const options = createRequestOption(req);
        return this.http.get<Link[]>(`${this.v2ResourceUrl}/${idOrKey}/links/sources?typeKeys=${linkTypeKey}`,
            {params: options, observe: 'response'});
    }

    fileExport(exportType: string, typeKey: string): Observable<Blob> {
        return this.http.get(`${this.resourceUrl}/export/`, {
            responseType: 'blob',
            params: {
                fileFormat: exportType ? exportType : 'csv',
                typeKey: typeKey
            }
        });
    }

    private convertResponse(res: HttpResponse<XmEntity>): HttpResponse<XmEntity> {
        const body: XmEntity = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<XmEntity[]>): HttpResponse<XmEntity[]> {
        const jsonResponse: XmEntity[] = res.body;
        const body: XmEntity[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
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

        copy.startDate = xmEntity.startDate instanceof Date ? xmEntity.startDate : this.dateUtils.toDate(xmEntity.startDate);

        copy.updateDate = xmEntity.updateDate instanceof Date ? xmEntity.updateDate : this.dateUtils.toDate(xmEntity.updateDate);

        copy.endDate = xmEntity.endDate instanceof Date ? xmEntity.endDate : this.dateUtils.toDate(xmEntity.endDate);
        return copy;
    }

    /**
     * Convert a InputContext to a JSON which can be sent to the server.
     */
    private convertFormData(inputContext: any): any {
        const copy = Object.assign({}, inputContext);
        return copy;
    }

}
