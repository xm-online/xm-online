import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { TimelinePage } from './timeline-page.model';
@Injectable()
export class TimelineService {

    private resourceUrl = 'timeline/api/timelines';

    constructor(private http: Http) { }

    search(id?: number): Observable<TimelinePage> {
        return this.http.get(this.resourceUrl, {
                params: {
                    limit: 10,
                    idOrKey : id
                }
        }).map((res: Response) => {
                return res.json();
            });
    }

    searchNext(id?: number, next?: string): Observable<TimelinePage> {
        return this.http.get(this.resourceUrl, {
            params: {
                limit: 10,
                idOrKey : id,
                next : next
            }
        }).map((res: Response) => {
            return res.json();
        });
    }

}
