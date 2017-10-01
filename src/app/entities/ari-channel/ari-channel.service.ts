import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class AriChannelService {

    private resourceUrl = '/ari/channels';

    constructor(private http: Http) {
    }

    query(): Observable<Response> {
        const headers = this.createHeaders();
        return this.http.get(this.resourceUrl, {
            headers: headers
        });
    }

    private createHeaders(): Headers {
        const username = 'asterisk';
        const password = 'asterisk';
        const headers: Headers = new Headers();
        headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return headers;
    }
}
