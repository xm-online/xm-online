import { Injectable } from '@angular/core';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';

import { Principal } from '../auth/principal.service';
import { getBrowserLang } from '../shared-libs.module';
import { XmApplicationConfigService } from '../spec/xm-config.service';
import { LANGUAGES } from './language.constants';
import { XM_EVENT_LIST } from '../../xm.constants';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ModulesLanguageHelper {

    config: any;

    constructor(private languageService: JhiLanguageService,
                private appConfig: XmApplicationConfigService,
                private $sessionStorage: SessionStorageService,
                private translateService: TranslateService,
                private eventManager: JhiEventManager,
                private principal: Principal) {
        this.config = this.appConfig.getAppConfig();
    }

    correctLang(langKey: string) {
        if (!this.principal.isAuthenticated()) {
            this.languageService.changeLanguage(langKey);
        } else {
            const lang = this.getLangKey();
            if (lang !== langKey) {this.languageService.changeLanguage(lang)}
        }
    }

    getLangKey(): string {
        const storageLang = this.$sessionStorage.retrieve('currentLang');
        const configDefaultLang = (this.config && this.config.langs && this.config.langs.length > 0)
            ? this.config.langs[0]
            : (getBrowserLang() || LANGUAGES[0]);
        if (storageLang) {
            return this.principal.getLangKey() || storageLang;
        } else {
            return this.principal.getLangKey() || configDefaultLang;
        }
    }

    public setLanguage(lang: string): void {
        this.languageService.changeLanguage(lang);
        this.translateService.setDefaultLang(lang);
        this.principal.setLangKey(lang);
        this.storeTranslates(lang);
        this.eventManager.broadcast({name: XM_EVENT_LIST.XM_CHANGE_LANGUAGE, content: lang});
    }

    public storeTranslates(langKey: string): void {
        this.translateService.getTranslation(langKey).subscribe((res) => {
            LANGUAGES.forEach((lang) => {
                this.$sessionStorage.clear(lang);
            });
            this.$sessionStorage.store(langKey, JSON.stringify(res));
            this.$sessionStorage.store('currentLang', langKey);
        });
    }
}
