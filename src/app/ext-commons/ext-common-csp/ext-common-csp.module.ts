import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { JhiLanguageHelper } from '../../shared';
import { ModulesLanguageHelper } from '../../shared/language/modules-language.helper';
import { XmSharedModule } from '../../shared/shared.module';
import { PhoneNumberChoiceWidgetComponent } from './phone-number-choice-widget/phone-number-choice-widget.component';

@NgModule({
    imports: [
        CommonModule,
        XmSharedModule
    ],
    declarations: [
        PhoneNumberChoiceWidgetComponent
    ],
    entryComponents: [
        PhoneNumberChoiceWidgetComponent
    ],
    providers: [
        {
            provide: 'phone-number-choice-widget', useValue: PhoneNumberChoiceWidgetComponent
        }
    ]
})
export class ExtCommonCspModule {
    constructor(private modulesLangHelper: ModulesLanguageHelper, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {this.modulesLangHelper.correctLang(languageKey)});
    }
}
