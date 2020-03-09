import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FindLanguageFromKeyPipe } from './find-language-from-key.pipe';
import { I18nJsfPipe } from './i18n-jsf.pipe';
import { I18nNamePipe } from './i18n-name.pipe';

@NgModule({
    declarations: [FindLanguageFromKeyPipe, I18nJsfPipe, I18nNamePipe],
    exports: [FindLanguageFromKeyPipe, I18nJsfPipe, I18nNamePipe],
    providers: [FindLanguageFromKeyPipe, I18nJsfPipe, I18nNamePipe],
    imports: [CommonModule],
})
export class LanguageModule {
}
