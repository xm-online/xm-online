import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '../../xm.constants';
import { Log } from './log.model';

@Injectable()
export class LogsService {
    constructor(private http: HttpClient) {
    }

    changeLevel(log: Log, service: string): Observable<HttpResponse<any>> {
        return this.http.put(SERVER_API_URL + `${service}/management/logs`, log, {observe: 'response'});
    }

    findByService(service: string): Observable<HttpResponse<Log[]>> {
        return this.http.get<Log[]>(SERVER_API_URL + `${service}/management/logs`, {observe: 'response'});
    }
}
