import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from '../../xm.constants';

@Injectable()
export class FunctionService {

    private resourceUrl: string = SERVER_API_URL + 'entity/api/functions';

    constructor(private http: HttpClient) {
    }

    public callEntityFunction(functionKey: string,
                              xmEntityId?: number,
                              inputContext?: any): Observable<HttpResponse<any>> {
        const copy = this.convert(inputContext);
        if (xmEntityId) {
            return this.callWithEntityId(xmEntityId, functionKey, copy);
        }
        return this.call(functionKey, copy);
    }

    public call(functionKey: string, inputContext?: any): Observable<HttpResponse<any>> {
        const copy = this.convert(inputContext);
        const url = this.resourceUrl + '/' + functionKey;
        if (this.isExportFunction(functionKey)) {
            return this.callXmDownloadFunction(url, copy);
        }
        return this.callXmFunction(url, copy);
    }

    public callWithEntityId(xmEntityId: number,
                            functionKey: string,
                            inputContext?: any): Observable<HttpResponse<any>> {
        const copy = this.convert(inputContext);
        const url = this.resourceEntityUrl(xmEntityId, functionKey);
        if (this.isExportFunction(functionKey)) {
            return this.callXmDownloadFunction(url, copy);
        }
        return this.callXmFunction(url, copy);
    }

    /**
     * There are no well defined field in spec to mark FILE UPLOAD startegy (base64, blob, arraybuffer)
     * so for now everything started like
     * `EXPORT-ARRAYBUFFER-` will be processed as `responseType: 'arraybuffer'`
     * @param key function key
     */
    private isExportFunction(key: string = ''): any {
        return key.toUpperCase().startsWith('EXPORT-ARRAYBUFFER-');
    }

    private resourceEntityUrl(id: any, key: string): any {
        return SERVER_API_URL + `entity/api/xm-entities/${id}/functions/${key}`;
    }

    private callXmFunction(url: string, inputContext: any = {}): Observable<HttpResponse<any>> {
        return this.http
            .post(url, inputContext, {observe: 'response', responseType: 'text'})
            .pipe(map((res: HttpResponse<any>) => this.convertResponse(res)));
    }

    /**
     * Function is used to tune angular downlaod to process responseType: 'arraybuffer'
     * @param url - resource url
     * @param inputContext - resource context
     */
    // tslint:disable-next-line:no-identical-functions
    private callXmDownloadFunction(url: string, inputContext: any = {}): Observable<HttpResponse<any>> {
        return this.http
            .post(url, inputContext, {observe: 'response', responseType: 'arraybuffer'})
            .pipe(map((res: HttpResponse<any>) => this.convertResponse(res)));
    }

    private convertResponse(res: HttpResponse<any>): HttpResponse<any> {
        const type = res.headers.get('content-type');
        if (type.includes('application/json')) {
            const body = this.convertItemFromServer(JSON.parse(res.body));
            return res.clone({body});
        } else {
            return Object.assign({actionType: 'download'}, res);
        }
    }

    /**
     * Convert a returned JSON object to any.
     */
    private convertItemFromServer(outputContext: any): any {
        return Object.assign({}, outputContext);
    }

    /**
     * Convert a InputContext to a JSON which can be sent to the server.
     */
    private convert(inputContext: any): any {
        return Object.assign({}, inputContext);
    }

}
