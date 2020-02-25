import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';
import swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

export type XmAlertOptions = SweetAlertOptions;
export type XmAlertResult = SweetAlertResult;

@Injectable({
    providedIn: 'root',
})
export class XmAlertService {

    constructor(protected translateService: TranslateService) {
    }

    public open(request: XmAlertOptions): Observable<XmAlertResult> {
        return from(swal(request));
    }

}
