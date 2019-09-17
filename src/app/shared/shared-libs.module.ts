import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgJhipsterModule } from 'ng-jhipster';

export function getBrowserLang() {
    const w: any = window;

    if (typeof w === 'undefined' || typeof w.navigator === 'undefined') {
        return undefined;
    }
    let browserLang = w.navigator.languages ? w.navigator.languages[0] : null;
    browserLang = browserLang || w.navigator.language || w.navigator.browserLanguage || w.navigator.userLanguage;
    if (browserLang.indexOf('-') !== -1) {
        browserLang = browserLang.split('-') [0];
    }
    if (browserLang.indexOf('_') !== -1) {
        browserLang = browserLang.split('_') [0];
    }
    return browserLang;
}

@NgModule({
    imports: [
        NgbModule,
        NgJhipsterModule.forRoot({
            alertAsToast: false,
            i18nEnabled: true,
            defaultI18nLang: 'en'
        })
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        NgbModule,
        NgJhipsterModule,
    ]
})
export class GateSharedLibsModule { }
