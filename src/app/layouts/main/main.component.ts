/* tslint:disable:typedef */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Idle } from 'idlejs/dist';
import { JhiEventManager } from 'ng-jhipster';
import { BehaviorSubject, Subscription } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LanguageService } from '../../modules/xm-translation/language.service';
import { TitleService } from '../../modules/xm-translation/title.service';
import { Principal } from '../../shared/auth/principal.service';
import { LoginService } from '../../shared/login/login.service';
import { XmConfigService } from '../../shared/spec/config.service';
import { XmApplicationConfigService } from '../../shared/spec/xm-config.service';
import { XM_EVENT_LIST } from '../../xm.constants';

declare let $: any;

@Component({
    selector: 'xm-main',
    templateUrl: './main.component.html',
})
export class XmMainComponent implements OnInit, OnDestroy {
    public showSidebar: boolean = true;
    public config: any;
    public resolved$: BehaviorSubject<boolean>;
    public isIdleEnabled: boolean;
    public isGuestLayout: boolean;
    public guestBg: string;
    public authSucessSubscription: Subscription;
    public isMaintenanceProgress$: BehaviorSubject<boolean>;
    public userAutoLogoutEnabled: boolean;
    public userAutoLogoutSeconds: number;
    public idle: Idle;
    private excludePathsForViewSidebar: string[] = ['/social-auth'];

    constructor(private configService: XmConfigService,
                private xmConfigService: XmApplicationConfigService,
                private router: Router,
                private loginService: LoginService,
                private languageService: LanguageService,
                private principal: Principal,
                protected titleService: TitleService,
                private eventManager: JhiEventManager) {
        this.resolved$ = new BehaviorSubject<boolean>(false);
        this.isMaintenanceProgress$ = new BehaviorSubject<boolean>(false);
        this.xmConfigService.isResolved().subscribe((res: boolean) => this.resolved$.next(res));
        this.xmConfigService.isMaintenanceProgress().subscribe((res: boolean) => this.isMaintenanceProgress$.next(res));
    }

    // tslint:disable-next-line:cognitive-complexity
    public ngOnInit(): void {
        this.languageService.init();
        this.titleService.init();
        this.configService.getUiConfig().subscribe((config) => {
            this.config = config ? config : null;
            this.prepareLayout();
            this.registerAuthenticationSuccess();
        });

        // TODO: const envType = environment.production ? 'PROD' : 'TEST';
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
                this.idleLogoutInit();
            }
            // TODO rethink to use in json form condition
            $.principal = this.principal;
        });

        // TODO #14219. workaround for dynamic expand height of textarea
        $('body').on('keyup', '.textarea-auto-height textarea', function(this: HTMLElement) {
            this.style.overflow = 'hidden';
            this.style.height = '52px';
            this.style.height = this.scrollHeight + 'px';
        });

        $(window).resize(() => {
            $('.textarea-auto-height textarea').each((pos, el) => {
                $(el).trigger('keyup');
            });
        });

        if (!$.emptyString) {
            $.emptyString = (str) => {
                if (str || str === false) {
                    return str;
                } else {
                    return '';
                }
            };
        }

        if (!$.wrapArray) {
            $.wrapArray = (arr) => {
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
                    console.info(`["${result}"]`);
                    return result;
                }
            };
        }

        // using in json form dataSpec interpolation
        // for avoid break dataSpec json
        if (!$.safe) {
            $.safe = (str) => {
                if (typeof str !== 'string') {
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
            };
        }
    }

    public ngOnDestroy(): void {
        // eslint-disable-next-line no-unused-expressions
        this.authSucessSubscription
            ? this.authSucessSubscription.unsubscribe()
            : console.info('No authSucessSubscription');
    }

    private registerAuthenticationSuccess(): void {
        this.principal.getAuthenticationState().subscribe((auth) => {
            if (auth) {
                this.loadPrivateConfig();
            }
        });

        this.authSucessSubscription = this.eventManager.subscribe(XM_EVENT_LIST.XM_SUCCESS_AUTH, (message) => {
            this.principal.identity();
            this.isGuestLayout = false;
            this.loadPrivateConfig();
        });
    }

    private loadPrivateConfig() {
        this.principal.hasPrivileges(['CONFIG.CLIENT.WEBAPP.GET_LIST.ITEM']).then((allowToRead) => {
            if (allowToRead) {
                this.xmConfigService.loadPrivateConfig();
            }
        })
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
            this.principal.identity().then((account) => {
                if (account) {
                    this.userAutoLogoutEnabled = account.autoLogoutEnabled || false;
                    this.userAutoLogoutSeconds = account.autoLogoutTimeoutSeconds || null;
                }
                const authenticated = this.principal.isAuthenticated();
                if (authenticated && !this.isIdleEnabled && this.userAutoLogoutEnabled && this.userAutoLogoutSeconds) {
                    this.idleAction(this.userAutoLogoutSeconds);
                    return undefined;
                }
                if (this.config && this.config.idleLogout && authenticated && !this.isIdleEnabled) {
                    this.idleAction(this.config.idleLogout);
                }
            });
        }
    }

    private idleAction(time: any): void {
        if (!environment.production) { console.info('>>> init idle logout in ' + time); }
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

    private prepareLayout(): void {
        this.isGuestLayout = true;
        this.principal.getAuthenticationState().subscribe((auth) => {
            if (!auth) {
                this.isGuestLayout = true;
            } else {
                this.isGuestLayout = false;
            }
        }, (error) => {
            console.info(error);
            this.isGuestLayout = false;
        });
    }

    private setBackground(): void {
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
