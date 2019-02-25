import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TwitterTimelineService {

    private TWITTER_SCRIPT_ID = 'twitter-wjs';
    private TWITTER_WIDGET_URL = 'https://platform.twitter.com/widgets.js';

    constructor() {
    }

    loadScript(): Observable<any> {
        const that = this;
        return Observable.create(observer => {
            that.startScriptLoad();
            window['twttr'].ready(
                function onLoadTwitterScript(twitter) {
                    observer.next(twitter);
                    observer.complete();
                }
            );
        });
    };

    private startScriptLoad() {
        window['twttr'] = (function (d, s, id, url) {
            const fjs = d.getElementsByTagName(s)[0];
            const t = window['twttr'] || {};

            if (d.getElementById(id)) {
                return t;
            }

            const js: any = d.createElement(s);
            js.id = id;
            js.src = url;
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function (f) {
                t._e.push(f);
            };

            return t;
        }(document, 'script', this.TWITTER_SCRIPT_ID, this.TWITTER_WIDGET_URL));
    }

}
