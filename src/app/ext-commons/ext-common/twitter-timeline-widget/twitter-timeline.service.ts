import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TwitterTimelineService {

    private TWITTER_SCRIPT_ID: string = 'twitter-wjs';
    private TWITTER_WIDGET_URL: string = 'https://platform.twitter.com/widgets.js';

    public loadScript(): Observable<any> {
        return Observable.create((observer) => {
            this.startScriptLoad();
            (window as any).twttr.ready((twitter) => {
                    observer.next(twitter);
                    observer.complete();
                },
            );
        });
    }

    private startScriptLoad(): void {
        (window as any).twttr = ((d, s, id, url) => {
            const fjs = d.getElementsByTagName(s)[0];
            const t = (window as any).twttr || {};

            if (d.getElementById(id)) {
                return t;
            }

            const js: any = d.createElement(s);
            js.id = id;
            js.src = url;
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = (f) => {
                t._e.push(f);
            };

            return t;
        })(document, 'script', this.TWITTER_SCRIPT_ID, this.TWITTER_WIDGET_URL);
    }

}
