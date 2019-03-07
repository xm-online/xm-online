import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_API_URL } from '../../xm.constants';
import { Location } from './location.model';

@Injectable()
export class LocationService {

    private resourceUrl = SERVER_API_URL + 'entity/api/locations';
    private resourceSearchUrl = SERVER_API_URL + 'entity/api/_search/locations';

    constructor(private http: HttpClient) {
    }

    create(location: Location): Observable<HttpResponse<Location>> {
        const copy = this.convert(location);
        return this.http.post<Location>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Location>) => this.convertResponse(res)));
    }

    update(location: Location): Observable<HttpResponse<Location>> {
        const copy = this.convert(location);
        return this.http.put<Location>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Location>) => this.convertResponse(res)));
    }

    find(id: number): Observable<HttpResponse<Location>> {
        return this.http.get<Location>(`${this.resourceUrl}/${id}`, {observe: 'response'}).pipe(
            map((res: HttpResponse<Location>) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Location[]>> {
        const options = createRequestOption(req);
        return this.http.get<Location[]>(this.resourceUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Location[]>) => this.convertArrayResponse(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Location[]>> {
        const options = createRequestOption(req);
        return this.http.get<Location[]>(this.resourceSearchUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<Location[]>) => this.convertArrayResponse(res)));
    }

    private convertResponse(res: HttpResponse<Location>): HttpResponse<Location> {
        const body: Location = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Location[]>): HttpResponse<Location[]> {
        const jsonResponse: Location[] = res.body;
        const body: Location[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Location.
     */
    private convertItemFromServer(location: Location): Location {
        const copy: Location = Object.assign({}, location);
        return copy;
    }

    /**
     * Convert a Location to a JSON which can be sent to the server.
     */
    private convert(location: Location): Location {
        const copy: Location = Object.assign({}, location);
        return copy;
    }
}
