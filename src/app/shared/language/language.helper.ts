import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LanguageService } from '../../modules/xm-translation/language.service';
import { TitleService } from '../../modules/xm-translation/title.service';
import { LANGUAGES } from './language.constants';

@Injectable({providedIn: 'root'})
export class JhiLanguageHelper {
    constructor(protected languageService: LanguageService,
                protected titleService: TitleService,
    ) {}

    /** @deprecated Use the LanguageService "locale$" instead */
    get language(): Observable<string> {
        return this.languageService.locale$;
    }

    /** @deprecated Use the LanguageService "languages" instead */
    public getAll(): Promise<any> {
        return Promise.resolve(LANGUAGES);
    }

    /**
     * Update the window title using params in the following
     * order:
     * 1. titleKey parameter
     * 2. $state.$current.data.pageTitle (current state page title)
     * 3. 'global.title'
     * @deprecated Use the TitleService set instead
     */
    public updateTitle(titleKey?: string): void {
        this.titleService.set(titleKey);
    }
}
