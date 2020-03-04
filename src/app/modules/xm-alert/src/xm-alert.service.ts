import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { from, Observable } from 'rxjs';
import swal, { SweetAlertOptions, SweetAlertResult, SweetAlertType } from 'sweetalert2';
import { XmAlertIntlService } from './xm-alert-intl.service';

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
                protected intl: XmAlertIntlService) {
    }

    public open(settings: XmAlertOptions): Observable<XmAlertResult> {

        if (!settings.confirmButtonClass) {
            settings.confirmButtonClass = this.intl.confirmButtonClass;
        }
        if (!settings.cancelButtonClass) {
            settings.cancelButtonClass = this.intl.cancelButtonClass;
        }

        if (!settings.confirmButtonText) {
            settings.confirmButtonText = this.intl.yesLabel;
        }
        if (!settings.cancelButtonText) {
            settings.cancelButtonText = this.intl.cancelLabel;
        }

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

        const DEFAULT: XmAlertOptions = {
            width: this.intl.width,
            buttonsStyling: this.intl.buttonsStyling,
            reverseButtons: this.intl.reverseButtons,
            showCloseButton: this.intl.showCloseButton,
        };

        return from(swal(_.merge(DEFAULT, settings)));
    }

}
