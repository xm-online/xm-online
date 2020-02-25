import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';
import swal, { SweetAlertOptions, SweetAlertResult, SweetAlertType } from 'sweetalert2';

export interface XmAlertOptions extends Partial<SweetAlertOptions> {
    type?: string | SweetAlertType | any;
}

export type XmAlertResult = SweetAlertResult;

@Injectable({
    providedIn: 'root',
})
export class XmAlertService {

    constructor(protected translateService: TranslateService) {
    }

    public open(settings: XmAlertOptions): Observable<XmAlertResult> {

        if (settings.title) {
            settings.title = this.translateService.instant(settings.title);
        }
        if (settings.text) {
            settings.text = this.translateService.instant(settings.text);
        }
        if (settings.confirmButtonText) {
            settings.confirmButtonText = this.translateService.instant(settings.confirmButtonText);
        }
        if (settings.cancelButtonText) {
            settings.cancelButtonText = this.translateService.instant(settings.cancelButtonText);
        }

        return from(swal(settings as SweetAlertOptions));
    }

}
