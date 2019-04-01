import {HttpClient, HttpResponse, HttpResponseBase} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from '../../xm.constants';

@Injectable()
export class FunctionService {

    private resourceUrl = SERVER_API_URL + 'entity/api/functions';

    constructor(private http: HttpClient) {
    }

    callEntityFunction(functionKey: string, xmEntityId?: number, inputContext?: any): Observable<HttpResponse<any>> {
        const copy = this.convert(inputContext);
        if (functionKey === 'EFDEMO_RETURN') {
            return of(new HttpResponse({body: {data: copy}}));
        }
        if (xmEntityId) {
            return this.callWithEntityId(xmEntityId, functionKey, copy)
        }
        return this.call(functionKey, copy)
    }

    call(functionKey: string, inputContext?: any): Observable<HttpResponse<any>> {
        const copy = this.convert(inputContext);
        return this.http
            .post(this.resourceUrl + '/' + functionKey, copy, {observe: 'response', responseType: 'text'})
            .pipe(map((res: HttpResponse<any>) => this.convertResponse(res)));
    }

    callWithEntityId(xmEntityId: number, functionKey: string, inputContext?: any): Observable<HttpResponse<any>> {
        const copy = this.convert(inputContext);
        return this.http
            .post(`entity/api/xm-entities/${xmEntityId}/functions/${functionKey}`, copy, {observe: 'response', responseType: 'text'})
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

    /**
     * Convert a InputContext to a JSON which can be sent to the server.
     */
    private convertAndMarkAsFile(outputContext: any): any {
        return Object.assign({}, outputContext);
    }

}
