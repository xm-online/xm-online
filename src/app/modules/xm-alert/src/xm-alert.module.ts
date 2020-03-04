import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XM_ALERT_INTL_PROVIDER } from './xm-alert-intl.service';

import { XmAlertService } from './xm-alert.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        XmTranslationModule,
    ],
    providers: [],
})
export class XmAlertModule {
    public static forRoot(): ModuleWithProviders<XmAlertModule> {
        return {
            ngModule: XmAlertModule,
            providers: [XmAlertService, XM_ALERT_INTL_PROVIDER],
        };
    }
}
