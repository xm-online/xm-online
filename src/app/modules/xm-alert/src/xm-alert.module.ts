import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmAlertComponent } from './xm-alert.component';
import { JhiAlertComponent } from './xm-alerts.component';
import { JhiAlertErrorComponent } from './alert-error.component';
import { XM_ALERT_CONFIG_PROVIDER } from './xm-alert-config.service';

import { XmAlertService } from './xm-alert.service';

@NgModule({
    declarations: [
        XmAlertComponent,
        JhiAlertComponent,
        JhiAlertErrorComponent,
    ],
    exports: [
        XmAlertComponent,
        JhiAlertComponent,
        JhiAlertErrorComponent,
    ],
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
            providers: [XmAlertService, XM_ALERT_CONFIG_PROVIDER],
        };
    }
}
