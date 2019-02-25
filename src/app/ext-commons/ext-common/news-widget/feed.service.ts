import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Feed} from './feed.model';

@Injectable()
export class FeedService {

    RSS_TO_JSON_URL = 'https://rss2json.com/api.json?rss_url=';

    constructor(private http: HttpClient) {
    }

    getFeedContent(url: string): Observable<Feed> {
        return this.http.get<Feed>(this.RSS_TO_JSON_URL + url);
    }

}
