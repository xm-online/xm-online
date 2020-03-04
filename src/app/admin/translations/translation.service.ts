import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XmEventManager } from '@xm-ngx/core';
import { Observable } from 'rxjs';

declare let $: any;

@Injectable()
export class TranslationService {

    constructor(private http: HttpClient,
                private eventManager: XmEventManager) {
    }

    public getFile(configPath: string): Observable<any> {
        return this.http.get<any>(configPath);
    }

    public translate(target: any, q: any): any {
        const url = 'https://www.googleapis.com/language/translate/v2';
        const key = 'AIzaSyBqzZZrc4Wgc5nAH4mMZjnjBSdv-425qgU';
        const jqxhr = $.ajax({
            type: 'POST',
            url: `${url}?key=${key}`,
            traditional: true,
            data: {
                source: 'en',
                target,
                q,
            },
        });
        jqxhr.fail((error) => {
            this.eventManager.broadcast({name: 'thirdpaty.httpError', content: error.responseJSON});
        });
        return jqxhr;
    }

}
