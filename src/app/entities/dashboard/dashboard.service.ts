import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Dashboard } from './dashboard.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import {Widget} from "../widget/widget.model";

@Injectable()
export class DashboardService {

    private resourceUrl = 'dashboard/api/dashboards';
    private resourceSearchUrl = 'dashboard/api/_search/dashboards';
    private widgetsUrl = 'dashboard/api/dashboards/{id}/widgets';

    constructor(private http: Http) { }

    create(dashboard: Dashboard): Observable<Dashboard> {
        const copy = this.convert(dashboard);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(dashboard: Dashboard): Observable<Dashboard> {
        const copy = this.convert(dashboard);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    getAll(): Observable<Dashboard[]> {
        return this.http.get(this.resourceUrl)
          .map((resp: Response) => resp.json());
    }

    find(id: number): Observable<Dashboard> {
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

    getWidgets(id: string): Observable<Widget[]> {
        return this.http.get(this.widgetsUrl.replace(/{id}/, id))
          .map((resp: Response) => resp.json());
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse);
    }

    private convert(dashboard: Dashboard): Dashboard {
        const copy: Dashboard = Object.assign({}, dashboard);
        return copy;
    }
}
