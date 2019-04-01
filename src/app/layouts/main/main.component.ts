import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Idle } from 'idlejs/dist';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';
import { BehaviorSubject, Subscription } from 'rxjs';

import { environment } from '../../../environments/environment';
import { JhiLanguageHelper, LANGUAGES } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { ModulesLanguageHelper } from '../../shared/language/modules-language.helper';
import { LoginService } from '../../shared/login/login.service';
import { XmConfigService } from '../../shared/spec/config.service';
import { XmApplicationConfigService } from '../../shared/spec/xm-config.service';
import { DEFAULT_LANG, XM_EVENT_LIST } from '../../xm.constants';
import { getBrowserLang } from './../../shared/shared-libs.module';

declare let $: any;

@Component({
    selector: 'xm-main',
    templateUrl: './main.component.html'
})
export class XmMainComponent implements OnInit, OnDestroy {
    showSidebar = true;
    config: any;
    resolved$: BehaviorSubject<boolean>;
    isIdleEnabled: boolean;
    isGuestLayout: boolean;
    guestBg: string;
    authSucessSubscription: Subscription;
    private excludePaths: Array<string> = ['/reset/finish', '/activate', '/social-auth'];
    private excludePathsForViewSidebar: Array<string> = ['/social-auth'];
    isMaintenanceProgress$: BehaviorSubject<boolean>;
    userAutoLogoutEnabled: boolean;
    userAutoLogoutSeconds: number;
    idle: Idle;

    constructor(private jhiLanguageHelper: JhiLanguageHelper,
                private modulesLangHelper: ModulesLanguageHelper,
                private jhiLanguageService: JhiLanguageService,
                private configService: XmConfigService,
                private xmConfigService: XmApplicationConfigService,
                private translateService: TranslateService,
                private router: Router,
                private loginService: LoginService,
                private principal: Principal,
                private $sessionStorage: SessionStorageService,
                private eventManager: JhiEventManager) {
        this.resolved$ = new BehaviorSubject<boolean>(false);
        this.isMaintenanceProgress$ = new BehaviorSubject<boolean>(false);
        this.xmConfigService.isResolved().subscribe((res: boolean) => this.resolved$.next(res));
        this.xmConfigService.isMaintenanceProgress().subscribe((res: boolean) => this.isMaintenanceProgress$.next(res));
    }

    ngOnInit() {
        this.configService.getUiConfig().subscribe(config => {
            this.config = config ? config : null;
            this.prepareLayout();
            this.registerAuthenticationSuccess();
        });

        // const envType = environment.production ? 'PROD' : 'TEST';
        const body = document.getElementsByTagName('body')[0];
        const isWindows = navigator.platform.indexOf('Win') > -1;

        // if we are on windows OS we activate the perfectScrollbar function
        body.classList.add(`perfect-scrollbar-${isWindows ? 'on' : 'off'}`);

        this.router.events.subscribe((event) => {
            this.setBackground();
            if (event instanceof NavigationStart) {
                this.showSidebar = this.excludePathsForViewSidebar.indexOf(event.url) === -1;
            }
            if (event instanceof NavigationEnd) {
                this.jhiLanguageHelper.updateTitle();
                this.updateLang();
                this.idleLogoutInit();
            }
            // TODO rethink to use in json form condition
            $.principal = this.principal;
        });

        // TODO #14219. workaround for dynamic expand height of textarea
        $('body').on('keyup', '.textarea-auto-height textarea', function (ev) {
            this.style.overflow = 'hidden';
            this.style.height = '52px';
            this.style.height = this.scrollHeight + 'px';
        });

        $(window).resize(() => {
            $('.textarea-auto-height textarea').each(function (pos, el) {
                $(el).trigger('keyup');
            });
        });

        if (!$.emptyString) {
            $.emptyString = function(str) {
                if (str || str === false) {
                    return str;
                } else {
                    return '';
                }
            }
        }

        if (!$.wrapArray) {
            $.wrapArray = function(arr) {
                if (!Array.isArray(arr)) {
                    return $.emptyString(arr);
                } else {
                    const result = [];
                    for (let i = 0; i < arr.length; i++) {
                        result[i] = $.safe(arr[i]);

                        if (arr.length === 1) {
                            break;
                        }

                        result[i] = i === 0 ? result[i] + '"' : result[i];
                        result[i] = i === arr.length - 1 ? '"' + result[i] : result[i];
                        result[i] = i > 0 && i < arr.length - 1 ? '"' + result[i] + '"' : result[i];
                    }
                    console.log(`["${result}"]`);
                    return result;
                }
            }
        }

        // using in json form dataSpec interpolation
        // for avoid break dataSpec json
        if (!$.safe) {
            $.safe = function(str) {
                if (!(typeof str === 'string')) {
                    return str;
                }

                return $.emptyString(str).replace(/\\n/g, '\\n')
                    .replace(/\\'/g, '\\\'')
                    .replace(/\\"/g, '\\"')
                    .replace(/\\&/g, '\\&')
                    .replace(/\\r/g, '\\r')
                    .replace(/\\t/g, '\\t')
                    .replace(/\\b/g, '\\b')
                    .replace(/\\f/g, '\\f');
            }
        }
    }

    private async updateLang() {
        const langKey = this.getLangFromProfileOrSession();
        if (langKey) {
            (!environment.production) && console.log('apply start language from Profile %s', langKey);
            this.setLanguage(langKey);
        } else {
            const cfgLang = await this.getDefaultLanguageConfiguration();
            this.setLanguage(cfgLang);
        }
    }

    private getLangFromProfileOrSession(): string {
        return this.modulesLangHelper.getLangKey();
    }

    private async getDefaultLanguageConfiguration() {
        const jhiLangCFG = await this.jhiLanguageHelper.getAll();
        const uiCfg = await this.configService.getUiConfig().toPromise();
        const availableLanguages = (uiCfg && uiCfg.langs) ? uiCfg.langs : jhiLangCFG;

        if (!availableLanguages) {
            console.log('No UI Language CFG or JHI cfg found');
            return DEFAULT_LANG;
        }
        // Return UI Default form CONFIG --> Browser if supported by CFG --> or [0] from supported;
        return availableLanguages.includes(uiCfg.defaultLang) ? uiCfg.defaultLang
            : availableLanguages.includes(getBrowserLang()) ? getBrowserLang()
                : availableLanguages[0];

    }

    private setLanguage (lang: string = DEFAULT_LANG): void {
        (!environment.production) && console.log('apply start language %s', lang);
        this.jhiLanguageService.changeLanguage(lang);
        this.translateService.setDefaultLang(lang);
        this.principal.setLangKey(lang);
        this.storeTranslates(lang);
        this.eventManager.broadcast({name: XM_EVENT_LIST.XM_CHANGE_LANGUAGE, content: lang});
    }

    ngOnDestroy() {
        this.authSucessSubscription ? this.authSucessSubscription.unsubscribe() : console.log('No authSucessSubscription');
    }

    private registerAuthenticationSuccess() {
        this.authSucessSubscription = this.eventManager.subscribe(XM_EVENT_LIST.XM_SUCCESS_AUTH, (message) => {
            this.principal.identity();
            this.isGuestLayout = false;
        });
    }

    private idleLogoutInit(): void {
        this.userAutoLogoutEnabled = false;
        this.userAutoLogoutSeconds = null;
        if (this.idle) {
            this.idle.stop();
            this.idle = null;
        }
        this.isIdleEnabled = false;
        if (this.principal.isAuthenticated()) {
            this.principal.identity().then(account => {
                if (account) {
                    this.userAutoLogoutEnabled = account.autoLogoutEnabled || false;
                    this.userAutoLogoutSeconds = account.autoLogoutTimeoutSeconds || null;
                }
                const authenticated = this.principal.isAuthenticated();
                if (authenticated && !this.isIdleEnabled && this.userAutoLogoutEnabled && this.userAutoLogoutSeconds) {
                    this.idleAction(this.userAutoLogoutSeconds);
                    return false;
                }
                if (this.config && this.config.idleLogout && authenticated && !this.isIdleEnabled) {
                    this.idleAction(this.config.idleLogout);
                }
            });
        }
    }

    private idleAction(time: any): void {
        (!environment.production) && console.log('>>> init idle logout in ' + time);
        this.isIdleEnabled = true;
        this.idle = new Idle()
            .whenNotInteractive()
            .within(parseFloat(time), 1000)
            .do(() => {
                this.loginService.logout();
                this.isIdleEnabled = false;
            })
            .start();
    }

    private storeTranslates(langKey: string): void {
        this.translateService.getTranslation(langKey).subscribe((res) => {
            LANGUAGES.forEach((lang) => {
                this.$sessionStorage.clear(lang);
            });
            this.$sessionStorage.store(langKey, JSON.stringify(res));
            this.$sessionStorage.store('currentLang', langKey);
        })
    }

    private prepareLayout() {
        this.isGuestLayout = true;
        this.principal.getAuthenticationState().subscribe(auth => {
            if (!auth) {
                this.isGuestLayout = true;
            } else {
                this.isGuestLayout = false;
            }
        }, error => {
            console.log(error);
            this.isGuestLayout = false;
        });
    }

    private setBackground() {
        if (this.config && this.config.loginScreenBg) {
            const currentRoute = this.router.url;
            if (currentRoute === '/') {
                this.guestBg = 'url(' + this.config.loginScreenBg + ')';
            } else {
                this.guestBg = null;
            }
        }
    }
}
