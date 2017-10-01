import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Widget } from './widget.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class WidgetService {

    private resourceUrl = 'dashboard/api/widgets';
    private resourceSearchUrl = 'dashboard/api/_search/widgets';

    constructor(private http: Http) { }

    create(widget: Widget): Observable<Widget> {
        const copy = this.convert(widget);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(widget: Widget): Observable<Widget> {
        const copy = this.convert(widget);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Widget> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
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
        return new ResponseWrapper(res.headers, jsonResponse);
    }

    private convert(widget: Widget): Widget {
        const copy: Widget = Object.assign({}, widget);
        return copy;
    }
}
