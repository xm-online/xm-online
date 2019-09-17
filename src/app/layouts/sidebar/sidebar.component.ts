import {Location} from '@angular/common';
import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {JhiEventManager, JhiLanguageService} from 'ng-jhipster';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import swal from 'sweetalert2';

import {ProfileService} from '../';
import {ContextService, I18nNamePipe, JhiLanguageHelper, LoginService, Principal} from '../../shared/';
import {XmConfigService} from '../../shared/spec/config.service';
import {Dashboard, DashboardWrapperService} from '../../xm-dashboard';
import { XmEntitySpecWrapperService } from '../../xm-entity';
import {DEBUG_INFO_ENABLED, VERSION, XM_EVENT_LIST} from '../../xm.constants';
import {transpilingForIE} from '../../shared/jsf-extention/jsf-attributes-helper';
import { PoweredBy } from '../../shared/components/powered-by/powered-by.model';


const misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0
};

declare let $: any;

@Component({
    moduleId: module.id,
    selector: 'xm-sidebar-cmp',
    templateUrl: './sidebar.component.html'
})

export class SidebarComponent implements OnInit, OnDestroy, AfterViewInit {

    private authSubscription: Subscription;
    private unauthSubscription: Subscription;
    private dashboardSubscription: Subscription;
    private contextSubscription: Subscription;
    private logoutSubscribtion: Subscription;

    private toggleButton;

    dashboardGroups: any[];
    uiConfig: any;

    inProduction: boolean;
    isNavbarCollapsed: boolean;
    languages: any[];
    swaggerEnabled: boolean;
    modalRef: NgbModalRef;
    version: string;
    applications: Promise<any[]>;
    dashboards: Dashboard[];
    location: Location;

    psMainPanel: any;

    isApplicationExists: boolean;

    tenantName: 'XM^online';
    userDescription$: Observable<any>;
    tenantLogoUrl: '../assets/img/logo-xm-online.png';
    iconsInMenu: false;
    poweredByConfig: PoweredBy;

    @ViewChild('navbar-cmp', {static: false}) button;

    constructor(private loginService: LoginService,
                private languageHelper: JhiLanguageHelper,
                private jhiLanguageService: JhiLanguageService,
                private xmEntitySpecWrapperService: XmEntitySpecWrapperService,
                public principal: Principal,
                private profileService: ProfileService,
                private router: Router,
                private element: ElementRef,
                private dashboardWrapperService: DashboardWrapperService,
                private xmConfigService: XmConfigService,
                private i18nNamePipe: I18nNamePipe,
                private translateService: TranslateService,
                private eventManager: JhiEventManager,
                private contextService: ContextService) {
        this.version = DEBUG_INFO_ENABLED ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
        // this.jhiLanguageService.addLocation('home');

        this.registerChangeAuth();
        this.registerChangeInDashboards();
        this.registerUnauthorized();
        this.registerLogoutEvent();
        this.contextSubscription = this.eventManager.subscribe('CONTEXT_UPDATED', () => {
            this.groupDashboards();
            this.collapseTab();
        });
    }

    ngOnInit() {
        this.xmConfigService.getUiConfig().subscribe(result => {
            this.uiConfig = result;
            this.languageHelper.getAll().then((languages) => {
                this.languages = (result && result.langs) ? result.langs : languages;
            });
            if (result['logoUrl']) {
                this.tenantLogoUrl = result['logoUrl'];
            }
            if (result['name']) {
                this.tenantName = result['name'];
            }
            if (result['iconsInMenu']) {
                this.iconsInMenu = result['iconsInMenu'];
            }

            this.tenantName = this.tenantName ? this.tenantName : 'XM^online';
            if (this.tenantName === 'XM^online') {
                this.tenantName += ' ' + this.version;
            }
            this.poweredByConfig = result.poweredBy || null;
        }, error => {
            console.log(error);
            this.tenantLogoUrl = '../assets/img/logo-xm-online.png';
            this.tenantName = 'XM^online';
        });

        this.principal.getAuthenticationState().subscribe(state => {
            if (state) {
                // no need to call this.loadData() only on manual refresh, otherwise method will be invoked by XM_EVENT_LIST.XM_SUCCESS_AUTH
                const sideBarMenuConfig = this.uiConfig && this.uiConfig.sidebarMenu || null;
                if (sideBarMenuConfig) {
                    this.userDescription$ = this.getUserDescription(sideBarMenuConfig);
                }
                this.loadData();
            }
        });
    }

    ngOnDestroy() {
        console.log('Destroy: sidebar');
        this.applications = null;
        this.dashboards = null;
        this.eventManager.destroy(this.authSubscription);
        this.eventManager.destroy(this.dashboardSubscription);
        this.eventManager.destroy(this.unauthSubscription);
        this.eventManager.destroy(this.contextSubscription);
        this.eventManager.destroy(this.logoutSubscribtion);

        if (this.psMainPanel) {
            this.psMainPanel.destroy();
        }
    }

    private registerLogoutEvent() {
        this.logoutSubscribtion = this.eventManager.subscribe(XM_EVENT_LIST.XM_LOGOUT, () => {
            this.logout(true);
        });
    }

    private registerUnauthorized() {
        this.unauthSubscription = this.eventManager.subscribe(XM_EVENT_LIST.XM_UNAUTHORIZED, () => {
            this.logout(true);
        });
    }

    private registerChangeAuth() {
        this.authSubscription = this.eventManager.subscribe(XM_EVENT_LIST.XM_SUCCESS_AUTH, event => {
            // console.log('Event: %o', event);
            this.loadData();
            // this.router.navigate([`/dashboard`, result[0].id])
        });
    }

    private registerChangeInDashboards() {
        this.dashboardSubscription = this.eventManager.subscribe(XM_EVENT_LIST.XM_DASHBOARD_LIST_MODIFICATION,
            resp => this.getDashboards(true));
    }

    private loadData() {
        // optimization, load data only if it is empty;
        if (!this.dashboards || this.dashboards.length === 0) {
            this.principal.hasPrivileges(['XMENTITY_SPEC.GET'])
                .then(result => {
                    if (result) {
                        // no need to load applciations, if they are loaded
                        if (!this.applications) {
                            this.applications = this.xmEntitySpecWrapperService.spec(true).then(spec => {
                                let applications = spec.types.filter(t => t.isApp)
                                    .filter(t => this.principal.hasPrivilegesInline(['APPLICATION.' + t.key]));
                                this.isApplicationExists = applications.length > 0;
                                return applications;
                            });
                            // this.applications.then(() => this.collapseTab());
                        }
                    }
                });

            this.principal.hasPrivileges(['DASHBOARD.GET_LIST'])
                .then(result => {
                    // no need to load dashboards, if they are loaded
                    result && this.dashboardWrapperService.dashboards(true).then((dashboards) => {
                        if (dashboards && dashboards.length) {
                            this.dashboards = dashboards.sort((a, b) => this.sortDashboards(a, b))
                        } else {
                            this.dashboards = dashboards;
                        }
                        this.groupDashboards();
                        this.collapseTab();
                    });
                });
        }

    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    logout(fast?: boolean) {

        const logoutAction = () => {
            this.loginService.logout();
            this.applications = null;
            this.dashboards = null;
            this.userDescription$ = null;
            this.router.navigate(['']);
            this.xmEntitySpecWrapperService.clear();
            $('body').addClass('xm-public-screen');
        };

        if (fast) {
            logoutAction();
        } else {
            swal({
                title: this.translateService.instant('global.common.are-you-sure'),
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonClass: 'btn mat-raised-button btn-primary',
                cancelButtonClass: 'btn mat-raised-button',
                confirmButtonText: this.translateService.instant('global.common.yes-exit'),
                cancelButtonText: this.translateService.instant('global.common.cancel')
            }).then((result) => result.value ? logoutAction() : console.log('Cancel'))
        }

    }

    getDashboards(force?: boolean) {
        this.dashboardWrapperService.dashboards(force).then((result) => {
            this.dashboards = result;
            this.collapseTab();
        });
    }

    getImageUrl() {
        return this.isAuthenticated() ? this.principal.getImageUrl() : null;
    }

    isNotMobileMenu() {
        return $(window).width() < 991;
    }

    private collapseTab() {
        setTimeout(() => {
            const sidebarMenuActive = $('.sidebar .nav > li.active > a:not([data-toggle="collapse"])');
            let $sidebarParent, collapseId;

            sidebarMenuActive && ($sidebarParent = sidebarMenuActive.parents('.collapse'));
            $sidebarParent && (collapseId = $sidebarParent.siblings('a').attr('href'));
            collapseId && $(collapseId).collapse('show');
        }, 100);
    }

    ngAfterViewInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        if ($('body').hasClass('sidebar-mini')) {
            misc.sidebar_mini_active = true;
        }
        $('#minimizeSidebar').click(function () {
            const $btn = $(this);

            if (misc.sidebar_mini_active === true) {
                $('body').removeClass('sidebar-mini');
                misc.sidebar_mini_active = false;

            } else {
                setTimeout(function () {
                    $('body').addClass('sidebar-mini');

                    misc.sidebar_mini_active = true;
                }, 300);
            }

            // we simulate the window Resize so the charts will get updated in realtime.
            const simulateWindowResize = setInterval(function () {
                window.dispatchEvent(new Event('resize'));
            }, 180);

            // we stop the simulation of Window Resize after the animations are completed
            setTimeout(function () {
                clearInterval(simulateWindowResize);
            }, 1000);
        });
    }

    private sortById(a, b): number {
        if (a.id > b.id) {
            return -1
        }
        if (a.id < b.id) {
            return 1
        }
        return 0;
    }

    private sortByConfig(a, b): number {
        const cfgA: any = a.config;
        const cfgB: any = b.config;
        if (cfgA && cfgA.orderIndex && cfgB && cfgB.orderIndex) {
            if (cfgA.orderIndex > cfgB.orderIndex) {
                return 1
            }
            if (cfgA.orderIndex < cfgB.orderIndex) {
                return -1
            }
            return 0;
        }
        return 0;
    }

    private sortByName(a, b): number {
        if (a.name > b.name) {
            return 1
        }
        if (a.name < b.name) {
            return -1
        }
        return 0;
    }

    private sortDashboards(a, b): number {
        if (a && b) {
            if (a.config && b.config) {
                return this.sortByConfig(a, b);
            } else {
                if (a.name && b.name) {
                    return this.sortByName(a, b);
                } else {
                    return this.sortById(a, b);
                }
            }
        }
        return 0;
    }

    private groupDashboards() {
        this.dashboardGroups = [];
        if (!this.dashboards) {
            return;
        }
        for (const dashboard of this.dashboards.filter(d => this.checkCondition(d))) {
            const menu = dashboard.config && dashboard.config.menu ? dashboard.config.menu : null;
            const groupIsLink = menu && menu.groupIsLink ? menu.groupIsLink : false;
            const orderIndex = menu && menu.group && menu.group.orderIndex ?
                menu.group.orderIndex :
                this.dashboards
                    .filter(d => this.checkCondition(d))
                    .length + 1;
            let groupKey = !menu ? 'DASHBOARD' : menu.group.key;
            const icon = menu && menu.group && menu.group.icon ? menu.group.icon : null;
            if (groupIsLink) {
                groupKey = dashboard.config && dashboard.config.slug ? dashboard.config.slug : null;
            }
            let group = this.dashboardGroups.filter(g => g.key === groupKey).shift();
            if (!group) {
                group = {
                    key: groupKey,
                    name: menu && menu.group ? menu.group.name : null,
                    groupIsLink: groupIsLink,
                    config: {
                        orderIndex: orderIndex,
                        icon: icon
                    },
                    dashboards: []
                };
                this.dashboardGroups.push(group);
                this.dashboardGroups.sort((a, b) => this.sortDashboards(a, b));
            }
            group.dashboards.push(dashboard);
            this.dashboardGroups.map(d => {
                if (d.dashboards && d.dashboards.length > 0) {
                    d.dashboards.sort((a, b) => this.sortDashboards(a, b));
                }
            });
        }
    }

    private checkCondition(dashboard): boolean {
        if (dashboard.config && dashboard.config.condition) {
            try {
                return !!(new Function('context', dashboard.config.condition))(this.contextService);
            } catch (e) {
                // console.log('--------------- e checkCondition', dashboard.config);
                const code = transpilingForIE(dashboard.config.condition, this.contextService);
                // console.log('--------------- code', code);
                return !!(new Function('context', `return ${code}`))(this.contextService);
            }
        } else {
            return true;
        }
    }

    private getUserDescription(config: any): Observable<any> {
        return this.principal
            .getXmEntityProfile()
            .pipe(
                map((body) => {
                    const descriptionPath =
                        config.userProfile.descriptionPath && config.userProfile.descriptionPath.split('.');
                    let value = body;
                    for (const key of descriptionPath) {
                        value = value[key];
                    }
                    return value;
                }),
                catchError(error => {
                    return of();
                })
            );
    }

    getDashboardName(dashboard) {
        let name = dashboard.name;
        if (dashboard.config && dashboard.config.name) {
            name = dashboard.config.name;
        }
        if (dashboard.config && dashboard.config.menu && dashboard.config.menu.name) {
            name = dashboard.config.menu.name;
        }
        return this.i18nNamePipe.transform(name, this.principal);
    }

    getDashboardIcon(dashboard) {
        let icon = '';
        if (dashboard && dashboard.config && dashboard.config.icon) {
            if (dashboard.config.icon === 'no-icon') {
                icon = '';
            } else {
                icon = `<i class="material-icons m-0 w-30" style="width: 30px;">${dashboard.config.icon}</i>`
            }
        } else {
            icon = this.getDashboardName(dashboard).charAt(0);
        }
        return icon;
    }

    getApplicationName(application) {
        const name = application.pluralName ? application.pluralName : application.name;
        return this.i18nNamePipe.transform(name, this.principal);
    }
}
