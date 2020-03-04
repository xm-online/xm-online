import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { from, Observable } from 'rxjs';
import swal, { SweetAlertOptions, SweetAlertResult, SweetAlertType } from 'sweetalert2';
import { XmAlertConfigService } from './xm-alert-config.service';

export interface XmAlertOptions extends Partial<SweetAlertOptions> {
    type?: string | SweetAlertType | any;

    textOptions?: {
        value?: string;
        [value: string]: string | object;
    };
}

export type XmAlertResult = SweetAlertResult;

@Injectable({
    providedIn: 'root',
})
export class XmAlertService {

    constructor(protected translateService: TranslateService,
                protected config: XmAlertConfigService) {
    }

    public open(settings: XmAlertOptions): Observable<XmAlertResult> {

        const DEFAULT: XmAlertOptions = {
            width: this.config.width,
            buttonsStyling: this.config.buttonsStyling,
            reverseButtons: this.config.reverseButtons,
            showCloseButton: this.config.showCloseButton,
            confirmButtonClass: this.config.confirmButtonClass,
            cancelButtonClass: this.config.cancelButtonClass,
            confirmButtonText: this.config.yesLabel,
            cancelButtonText: this.config.cancelLabel,
        };
        settings = _.merge(DEFAULT, settings);

        if (settings.title) {
            settings.title = this.translateService.instant(settings.title);
        }
        if (settings.text) {
            const opts = settings.textOptions || {};
            _.defaults(opts, {value: ''});

            settings.text = this.translateService.instant(settings.text, opts);
        }

        if (settings.confirmButtonText) {
            settings.confirmButtonText = this.translateService.instant(settings.confirmButtonText);
        }
        if (settings.cancelButtonText) {
            settings.cancelButtonText = this.translateService.instant(settings.cancelButtonText);
        }

        return from(swal(settings));
    }

}
