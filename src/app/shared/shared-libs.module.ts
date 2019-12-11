import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgJhipsterModule } from 'ng-jhipster';
import { XmTranslationModule } from '../modules/xm-translation/xm-translation.module';

@NgModule({
    imports: [
        NgbModule,
        NgJhipsterModule,
        XmTranslationModule.forChild(),
    ],
    providers: [],
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
