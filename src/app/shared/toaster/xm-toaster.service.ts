import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JhiAlert, JhiAlertService } from 'ng-jhipster';
import { Observable } from 'rxjs';

export interface ToasterConfig extends JhiAlert {
    params?: { value?: string } | any;
}

@Injectable({
    providedIn: 'root',
})
export class XmToasterService {

    constructor(protected translateService: TranslateService,
                protected alertService: JhiAlertService) {
    }

    public create(params: ToasterConfig): Observable<ToasterConfig[]> {
        return new Observable((observer) => {

            if (params.close) {
                params.close = (args) => {
                    params.close(args);
                    observer.next(args);
                    observer.complete();
                };
            } else {
                params.close = close;
            }

            this.alertService.addAlert(params, []);
        });
    }

}
