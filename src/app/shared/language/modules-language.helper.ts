import { Injectable } from '@angular/core';
import { LanguageService } from '../../modules/xm-translation/language.service';

@Injectable({providedIn: 'root'})
export class ModulesLanguageHelper {

    constructor(private languageService: LanguageService) {
    }

    /** @deprecated use LanguageService "locale" instead */
    public correctLang(langKey: string): void {
        this.languageService.locale = langKey;
    }

    /** @deprecated use LanguageService "locale" instead */
    public getLangKey(): string {
        return this.languageService.locale;
    }
}
