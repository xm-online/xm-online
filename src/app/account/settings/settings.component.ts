import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';
import { Observable, Subscription ,  interval } from 'rxjs';
import { map } from 'rxjs/operators';

import { Principal, AccountService, JhiLanguageHelper } from '../../shared';
import { XmConfigService } from '../../shared/spec/config.service';
import { DEFAULT_LANG } from '../../xm.constants';

@Component({
    selector: 'xm-settings',
    templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy, AfterViewInit {

    private _clockSubscription: Subscription;

    error: string;
    success: string;
    securityChanged: boolean;
    settingsAccount: any;
    languages: any[];
    tfaEnabled: boolean;
    autoLogoutEnabled: boolean;
    autoLogoutTime: number;
    clock: Observable<Date>;
    time: any;
    utcTime: any;
    timeZoneOffset: string;

    constructor(private accountService: AccountService,
                private xmConfigService: XmConfigService,
                private principal: Principal,
                private datePipe: DatePipe,
                private jhiLanguageService: JhiLanguageService,
                private languageHelper: JhiLanguageHelper,
                private xmConfig: XmConfigService) {
        this.principal.identity().then((account) => {
            this.settingsAccount = this.copyAccount(account);
            this.tfaEnabled = this.settingsAccount.tfaEnabled;
            this.autoLogoutTime = this.settingsAccount.autoLogoutTime;
            this.autoLogoutEnabled = this.settingsAccount.autoLogoutEnabled;
            this.securityChanged = false;
            this.updateLang();
            this.timeZoneOffset = account.timeZoneOffset || '';
        });
    }

    ngOnInit() {
        this.xmConfig.getUiConfig().subscribe(
            (data) => {
                this.languages = (data && data.langs) ? data.langs : [DEFAULT_LANG];
            },
            (err) => {
                console.log(err);
                this.languages = [DEFAULT_LANG]
            }, () => console.log('Languages: %o', this.languages)
        );
        this.clock = interval(1000).pipe(map(tick => new Date()));
        this._clockSubscription = this.getClock().subscribe(time => {
            this.time = this.utcTime = time;
        });
    }

    ngOnDestroy(): void {
        this._clockSubscription.unsubscribe();
    }

    getClock(): Observable<Date> {
        return this.clock;
    }

    ngAfterViewInit() {
        this.updateLang();
    }

    updateLang() {
        if (!this.languages || !this.settingsAccount) {
            return;
        }

        for (const lang of this.languages) {
            if (lang === this.settingsAccount.langKey) {
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
                    this.jhiLanguageService.changeLanguage(this.settingsAccount.langKey);
                }
            });
        }, () => {
            this.success = null;
            this.error = 'ERROR';
        });
    }

    private findEmail(account: any): string {
      if (account && account.logins) {
        for (const entry of account.logins) {
          if (entry.typeKey = 'LOGIN.EMAIL') {
            return entry.login;
          }
        }
      }
      return '';
    }

    updateSecuritySettings() {

        // LOGIN.EMAIL
        if (this.tfaEnabled) {
          this.accountService.enableTFA('email', this.findEmail(this.settingsAccount)).subscribe(() => {
              this.securityChanged = true;
              this.updatePrincipalIdentity();
          });
        } else {
          this.accountService.disableTFA().subscribe(() => {
              this.securityChanged = true;
              this.updatePrincipalIdentity();
          });
        }

    }

    private updatePrincipalIdentity() {
      this.principal.identity(true).then((account) => {
        this.settingsAccount = this.copyAccount(account);
      });
    }

    private copyAccount(account) {
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
            refreshTokenValiditySeconds: account.refreshTokenValiditySeconds,
            tfaEnabled: account.tfaEnabled,
            autoLogoutEnabled: account.autoLogoutEnabled,
            autoLogoutTime: account.autoLogoutTimeoutSeconds
        };
    }
}
