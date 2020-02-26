import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JhiConfigService, NgJhipsterModule } from 'ng-jhipster';
import { XmTranslationModule } from '@xm-ngx/translation';

@NgModule({
    imports: [
        NgbModule,
        NgJhipsterModule,
        XmTranslationModule.forChild(),
    ],
    providers: [
        {
            provide: JhiConfigService,
            useValue: new JhiConfigService({defaultI18nLang: 'en', i18nEnabled: true}),
        },
    ],
    exports: [
        FormsModule,
        NgJhipsterModule,
        XmTranslationModule,
        ReactiveFormsModule,
        CommonModule,
        NgbModule,
    ],
})
export class GateSharedLibsModule {
}
