import { Injectable } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';

import { Principal } from '../auth/principal.service';
import { getBrowserLang } from '../shared-libs.module';
import { XmApplicationConfigService } from '../spec/xm-config.service';
import { LANGUAGES } from './language.constants';


@Injectable()
export class ModulesLanguageHelper {

    config: any;

    constructor(private languageService: JhiLanguageService,
                private appConfig: XmApplicationConfigService,
                private $sessionStorage: SessionStorageService,
                private principal: Principal) {
        this.config = appConfig.getAppConfig();
    }

    correctLang(langKey: string) {
        if (!this.principal.isAuthenticated()) {
            this.languageService.changeLanguage(langKey)
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
}
