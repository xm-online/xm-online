import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Principal } from '../../shared';

declare let $: any;

@Injectable()
export class TranslationService {

    constructor(private http: HttpClient,
                private eventManager: JhiEventManager,
                private principal: Principal) {
    }

    getFile(configPath: string): Observable<any> {
        return this.http.get(configPath).pipe(map((res: Response) => { return res.json(); }));
    }

    translate(target, q) {
        const self = this;
        const url = 'https://www.googleapis.com/language/translate/v2';
        const key = 'AIzaSyBqzZZrc4Wgc5nAH4mMZjnjBSdv-425qgU';
        const jqxhr = $.ajax({
            type: 'POST',
            url: `${url}?key=${key}`,
            traditional: true,
            data: {
                'source': 'en',
                'target': target,
                'q': q
            }
        });
        jqxhr.fail(function (error) {
            self.eventManager.broadcast({name: 'thirdpaty.httpError', content: error.responseJSON});
        });
        return jqxhr;
    }

}
