import { NgModule } from '@angular/core';

import { FindLanguageFromKeyPipe, GateSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';
import { XmAlertComponent } from './alert/xm-alert.component';

@NgModule({
    imports: [
        GateSharedLibsModule,
    ],
    declarations: [
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        XmAlertComponent,
    ],
    exports: [
        GateSharedLibsModule,
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        XmAlertComponent,
    ],
})
export class GateSharedCommonModule {
}
