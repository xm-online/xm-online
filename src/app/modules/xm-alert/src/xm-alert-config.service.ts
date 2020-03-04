import { Injectable, Optional, SkipSelf } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class XmAlertConfigService {

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

export function XM_ALERT_CONFIG_PROVIDER_FACTORY(parentConfig: XmAlertConfigService): XmAlertConfigService {
    return parentConfig || new XmAlertConfigService();
}

export const XM_ALERT_CONFIG_PROVIDER = {
    provide: XmAlertConfigService,
    deps: [[new Optional(), new SkipSelf(), XmAlertConfigService]],
    useFactory: XM_ALERT_CONFIG_PROVIDER_FACTORY,
};
