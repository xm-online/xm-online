import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { DefaultProfile } from './default-profile.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class DefaultProfileService {

    private resourceUrl = 'dashboard/api/default-profiles';
    private resourceSearchUrl = 'dashboard/api/_search/default-profiles';

    constructor(private http: Http) { }

    create(defaultProfile: DefaultProfile): Observable<DefaultProfile> {
        const copy = this.convert(defaultProfile);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(defaultProfile: DefaultProfile): Observable<DefaultProfile> {
        const copy = this.convert(defaultProfile);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<DefaultProfile> {
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

    private convert(defaultProfile: DefaultProfile): DefaultProfile {
        const copy: DefaultProfile = Object.assign({}, defaultProfile);
        return copy;
    }
}
