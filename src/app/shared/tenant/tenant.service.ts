import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Tenant } from './tenant.model';

@Injectable()
export class TenantService {

    private resourceUrl = 'uaa/api/tenants';

    constructor(private http: Http) { }

    current() : Observable<Tenant> {
        return this.http.get(this.resourceUrl).map((res: Response) => res.json());
    }

}
