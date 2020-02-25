import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JhiAlert, JhiAlertService } from 'ng-jhipster';
import { Observable } from 'rxjs';

export interface ToasterConfig extends Partial<JhiAlert> {
    text?: string;
    msg?: string | undefined;
}

@Injectable({
    providedIn: 'root',
})
export class XmToasterService {

    constructor(protected translateService: TranslateService,
                protected alertService: JhiAlertService) {
    }

    public create(params: ToasterConfig): Observable<ToasterConfig[]> {

        if (params.text) {
            params.msg = params.text;
        }

        if (params.msg) {
            params.msg = this.translateService.instant(params.msg);
        }

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

            this.alertService.addAlert(params as JhiAlert, []);
        });
    }

    /** @deprecated use create instead */
    public success(text: string, params?: any, position?: string): void {
        this.create({type: 'success', text, params, position}).subscribe();
    }

    /** @deprecated use create instead */
    public danger(text: string, params?: any, position?: string): void {
        this.create({type: 'danger', text, params, position}).subscribe();
    }

    /** @deprecated use danger instead */
    public error(text: string, params?: any, position?: string): void {
        this.danger(text, params, position);
    }

    /** @deprecated use create instead */
    public warning(text: string, params?: any, position?: string): void {
        this.create({type: 'warning', text, params, position}).subscribe();
    }

    /** @deprecated use create instead */
    public info(text: string, params?: any, position?: string): void {
        this.create({type: 'info', text, params, position}).subscribe();
    }

}
