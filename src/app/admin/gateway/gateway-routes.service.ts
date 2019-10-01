import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GatewayRoute } from './gateway-route.model';

@Injectable()
export class GatewayRoutesService {
    constructor(private http: HttpClient) { }

    findAll(): Observable<GatewayRoute[]> {
        return this.http.get<GatewayRoute[]>('api/gateway/routes/');
    }
}
