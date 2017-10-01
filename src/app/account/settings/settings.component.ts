import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {JhiLanguageService} from 'ng-jhipster';

import {Principal, AccountService, JhiLanguageHelper} from '../../shared';

declare var $: any;

@Component({
    selector: 'xm-settings',
    templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, AfterViewInit {
    error: string;
    success: string;
    settingsAccount: any;
    languages: any[];

    constructor(private accountService: AccountService,
                private principal: Principal,
                private jhiLanguageService: JhiLanguageService,
                private languageHelper: JhiLanguageHelper) {
        this.jhiLanguageService.addLocation('settings');
        this.principal.identity(true, true).then((account) => {
            this.settingsAccount = this.copyAccount(account);
            this.updateLang();
        });
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.languageHelper.getAll().then((languages) => {
            this.languages = languages;
            this.updateLang();
            setTimeout(function(){
                $('.selectpicker').selectpicker({
                    size: 4
                });
            }, 1);
        });
    }

    updateLang() {
        if (!this.languages || !this.settingsAccount) {
            return;
        }

        for (let lang of this.languages) {
            if (lang == this.settingsAccount.langKey) {
                return;
            }
        }

        this.settingsAccount.langKey = this.languages[0];
    }

    save() {
        this.accountService.save(this.settingsAccount).subscribe(() => {
            this.error = null;
            this.success = 'OK';
            this.principal.identity(true).then((account) => {
                this.settingsAccount = this.copyAccount(account);
            });
            this.jhiLanguageService.getCurrent().then((current) => {
                if (this.settingsAccount.langKey !== current) {
                    console.log(this.settingsAccount.langKey);
                    this.jhiLanguageService.changeLanguage(this.settingsAccount.langKey);
                }
            });
        }, () => {
            this.success = null;
            this.error = 'ERROR';
        });
    }

    copyAccount(account) {
        return {
            id: account.id,
            userKey: account.userKey,
            activated: account.activated,
            firstName: account.firstName,
            langKey: account.langKey,
            lastName: account.lastName,
            logins: account.logins,
            imageUrl: account.imageUrl,
            accessTokenValiditySeconds: account.accessTokenValiditySeconds,
            refreshTokenValiditySeconds: account.refreshTokenValiditySeconds
        };
    }
}
