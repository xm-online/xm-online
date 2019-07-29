import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class Activate {

    constructor(private http: HttpClient) {
    }

    public get(key: string): Observable<any> {
        let params = new HttpParams();
        params = params.set('key', key);
        return this.http.get('uaa/api/activate', {params, observe: 'response'});
    }

}
