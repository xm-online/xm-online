import { NgModule, Sanitizer } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from 'ng2-translate';
import { AlertService } from 'ng-jhipster';
import {
    JhiLanguageHelper,
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent
} from './';
import {XmAlertComponent} from './alert/xm-alert.component';
import {GateSharedLibsModule} from "./shared-libs.module";
import {CustomTranslatePartialLoader} from './language/language.loader';

export function alertServiceProvider(sanitizer: Sanitizer, translateService: TranslateService) {
    // set below to true to make alerts look like toast
    const isToast = false;
    return new AlertService(sanitizer, isToast, translateService);
}

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
        {
            provide: AlertService,
            useFactory: alertServiceProvider,
            deps: [Sanitizer, TranslateService]
        },
        Title,
        CustomTranslatePartialLoader
    ],
    exports: [
        GateSharedLibsModule,
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        XmAlertComponent,
    ]
})
export class GateSharedCommonModule {}
