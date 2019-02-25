import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Client } from './client.model';

@Injectable()
export class ClientService {

    private resourceUrl = 'uaa/api/clients';


    constructor(private http: HttpClient) {
    }

    create(client: Client): Observable<HttpResponse<any>> {
        return this.http.post(this.resourceUrl, client, {observe: 'response'});
    }

    update(client: Client): Observable<HttpResponse<any>> {
        return this.http.put(this.resourceUrl, client, {observe: 'response'});
    }

    find(id: number): Observable<Client> {
        return this.http.get<Client>(`${this.resourceUrl}/${id}`);
    }

    query(req?: any): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        if (req) {
            params = params.set('page', req.page);
            params = params.set('size', req.size);
            if (req.sort) {
                req.sort.forEach((val) => {
                    params = params.append('sort', val);
                });
            }
        }
        return this.http.get(this.resourceUrl, {params: params, observe: 'response'});
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }
}
