import { Injectable, Optional, SkipSelf } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class XmAlertIntlService {

    public yesLabel: string = 'global.common.yes';
    public width: number = 400;
    public buttonsStyling: boolean = false;
    public showCloseButton: boolean = true;
    public noLabel: string = 'global.common.no';
    public cancelLabel: string = 'global.common.cancel';
    public reverseButtons: boolean = true;

    public confirmButtonClass: string = 'btn btn-outline-primary border-0 mx-1';
    public cancelButtonClass: string = 'btn btn-outline-dark border-0 mx-1';
}

export function XM_ALERT_INTL_PROVIDER_FACTORY(parentIntl: XmAlertIntlService) {
    return parentIntl || new XmAlertIntlService();
}

export const XM_ALERT_INTL_PROVIDER = {
    provide: XmAlertIntlService,
    deps: [[new Optional(), new SkipSelf(), XmAlertIntlService]],
    useFactory: XM_ALERT_INTL_PROVIDER_FACTORY,
};
