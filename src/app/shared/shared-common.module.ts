import { NgModule, LOCALE_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/en';

import {
    GateSharedLibsModule,
    JhiLanguageHelper,
    ModulesLanguageHelper,
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent
} from './';
import {XmAlertComponent} from './alert/xm-alert.component';

@NgModule({
    imports: [
        GateSharedLibsModule
    ],
    declarations: [
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        XmAlertComponent,
    ],
    providers: [
        JhiLanguageHelper,
        ModulesLanguageHelper,
        Title,
        {
            provide: LOCALE_ID,
            useValue: 'en'
        },
    ],
    exports: [
        GateSharedLibsModule,
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        XmAlertComponent
    ]
})
export class GateSharedCommonModule {
    constructor() {
        registerLocaleData(locale);
    }
}
