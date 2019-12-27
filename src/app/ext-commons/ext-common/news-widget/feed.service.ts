import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feed } from './feed.model';

@Injectable()
export class FeedService {

    public RSS_TO_JSON_URL: string = 'https://rss2json.com/api.json?rss_url=';

    constructor(private http: HttpClient) {
    }

    public getFeedContent(url: string): Observable<Feed> {
        return this.http.get<Feed>(this.RSS_TO_JSON_URL + url);
    }

}
