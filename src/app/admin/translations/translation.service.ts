import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, Headers, RequestOptionsArgs} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {EventManager} from 'ng-jhipster';
import {Principal} from 'app/shared';

declare let $: any;

@Injectable()
export class TranslationService {

    constructor(private http: Http,
                private eventManager: EventManager,
                private principal: Principal) {
    }

    getFile(configPath: string): Observable<any> {
        return this.http.get(configPath).map((res: Response) => {
            return res.json();
        });
    }

    private headers(): RequestOptions {
        let headers = new Headers({ 'Content-Type': 'text/plain' });
        let optArgs: RequestOptionsArgs = { headers: headers };
        return new RequestOptions(optArgs);
    }

    translate(target, q) {
        let self = this;
        let url = "https://www.googleapis.com/language/translate/v2";
        let key = 'AIzaSyBqzZZrc4Wgc5nAH4mMZjnjBSdv-425qgU';
        var jqxhr = $.ajax({
            type: "POST",
            url:`${url}?key=${key}`,
            traditional: true,
            data: {
                'source': 'en',
                'target': target,
                'q': q
            }
        });
        jqxhr.fail(function(error) {
            self.eventManager.broadcast( {name: 'thirdpaty.httpError', content: error.responseJSON});
        });
        return jqxhr;
    }

}
