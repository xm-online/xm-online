import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TimelinePage } from './timeline-page.model';

@Injectable()
export class TimelineService {

    private LIMIT: number = 10;
    private resourceUrl: string = 'timeline/api/timelines';

    constructor(private http: HttpClient) {
    }

    private static toHttpParams(obj: Object): HttpParams {
        let params = new HttpParams();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const val = obj[key];
                if (val !== null && val !== undefined) {
                    params = params.append(key, val.toString());
                }
            }
        }
        return params;
    }

    public search(options: any = {}): Observable<TimelinePage> {
        const params = {
            limit: options.limit || this.LIMIT,
            idOrKey: options.id,
            msName: options.msName,
            userKey: options.userKey,
            dateFrom: options.dateFrom,
            dateTo: options.dateTo,
            operation: options.operation,
            next: options.next,
        };
        return this.http.get<TimelinePage>(this.resourceUrl, {params: TimelineService.toHttpParams(params)});
    }

}
