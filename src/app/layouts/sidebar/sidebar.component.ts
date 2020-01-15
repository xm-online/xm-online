import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import swal from 'sweetalert2';

import { ContextService, I18nNamePipe, JhiLanguageHelper, LoginService, Principal } from '../../shared/';
import { PoweredBy } from '../../shared/components/powered-by/powered-by.model';
import { transpilingForIE } from '../../shared/jsf-extention/jsf-attributes-helper';
import { XmConfigService } from '../../shared/spec/config.service';
import { Dashboard, DashboardWrapperService } from '../../xm-dashboard';
import { XmEntitySpecWrapperService } from '../../xm-entity';
import { DEBUG_INFO_ENABLED, VERSION, XM_EVENT_LIST } from '../../xm.constants';

const misc = {
    sidebarMiniActive: false,
};

declare let $: any;

function sortById(a: Dashboard, b: Dashboard): number {
    if (a.id > b.id) {
        return -1;
    }
    if (a.id < b.id) {
        return 1;
    }
    return 0;
}

function sortByName(a: Dashboard, b: Dashboard): number {
    if (a.name > b.name) {
        return 1;
    }
    if (a.name < b.name) {
        return -1;
    }
    return 0;
}

function sortByConfig(a: Dashboard, b: Dashboard): number {
    const cfgA: any = a.config;
    const cfgB: any = b.config;
    if (cfgA && cfgA.orderIndex && cfgB && cfgB.orderIndex) {
        if (cfgA.orderIndex > cfgB.orderIndex) {
            return 1;
        }
        if (cfgA.orderIndex < cfgB.orderIndex) {
            return -1;
        }
        return 0;
    }
    return 0;
}

function sortDashboards(a: Dashboard, b: Dashboard): number {
    if (a && b) {
        if (a.config && b.config) {
            return sortByConfig(a, b);
        } else {
            if (a.name && b.name) {
                return sortByName(a, b);
            } else {
                return sortById(a, b);
            }
        }
    }
    return 0;
}

@Component({
    moduleId: module.id,
    selector: 'xm-sidebar-cmp',
    templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit, OnDestroy, AfterViewInit {

    public toggleButton: any;
    public dashboardGroups: any[];
    public uiConfig: any;
    public inProduction: boolean;
    public isNavbarCollapsed: boolean;
    public languages: any[];
    public swaggerEnabled: boolean;
    public modalRef: NgbModalRef;
    public version: string;
    public applications: Promise<any[]>;
    public dashboards: Dashboard[];
    public location: Location;
    public psMainPanel: any;
    public isApplicationExists: boolean;
    public tenantName: 'XM^online';
    public userDescription$: Observable<any>;
    public tenantLogoUrl: '../assets/img/logo-xm-online.png';
    public iconsInMenu: false;
    public poweredByConfig: PoweredBy;
    @ViewChild('navbar-cmp', {static: false}) public button: any;
    private authSubscription: Subscription;
    private unauthSubscription: Subscription;
    private dashboardSubscription: Subscription;
    private contextSubscription: Subscription;
    private logoutSubscribtion: Subscription;

    constructor(private loginService: LoginService,
                private languageHelper: JhiLanguageHelper,
                private xmEntitySpecWrapperService: XmEntitySpecWrapperService,
                public principal: Principal,
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
        // TODO: this.jhiLanguageService.addLocation('home');

        this.registerChangeAuth();
        this.registerChangeInDashboards();
        this.registerUnauthorized();
        this.registerLogoutEvent();
        this.contextSubscription = this.eventManager.subscribe('CONTEXT_UPDATED', () => {
            this.groupDashboards();
            this.collapseTab();
        });
    }

    // tslint:disable-next-line:cognitive-complexity
    public ngOnInit(): void {
        this.xmConfigService.getUiConfig().subscribe((result) => {
            this.uiConfig = result;
            this.languageHelper.getAll().then((languages) => {
                this.languages = (result && result.langs) ? result.langs : languages;
            });
            if (result.logoUrl) {
                this.tenantLogoUrl = result.logoUrl;
            }
            if (result.name) {
                this.tenantName = result.name;
            }
            if (result.iconsInMenu) {
                this.iconsInMenu = result.iconsInMenu;
            }

            this.tenantName = this.tenantName ? this.tenantName : 'XM^online';
            if (this.tenantName === 'XM^online') {
                this.tenantName += ' ' + this.version;
            }
            this.poweredByConfig = result.poweredBy || null;
        }, (error) => {
            console.info(error);
            this.tenantLogoUrl = '../assets/img/logo-xm-online.png';
            this.tenantName = 'XM^online';
        });

        this.principal.getAuthenticationState().subscribe((state) => {
            if (state) {
                // no need to call this.loadData() only on manual refresh,
                // otherwise method will be invoked by XM_EVENT_LIST.XM_SUCCESS_AUTH
                const sideBarMenuConfig = this.uiConfig && this.uiConfig.sidebarMenu || null;
                if (sideBarMenuConfig) {
                    this.userDescription$ = this.getUserDescription(sideBarMenuConfig);
                }
                this.loadData();
            }
        });
    }

    public ngOnDestroy(): void {
        console.info('Destroy: sidebar');
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

    public isAuthenticated(): boolean {
        return this.principal.isAuthenticated();
    }

    public logout(fast: boolean = false): void {

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
                cancelButtonText: this.translateService.instant('global.common.cancel'),
            }).then((result) => result.value ? logoutAction() : console.info('Cancel'));
        }

    }

    public getDashboards(force: boolean = false): void {
        this.dashboardWrapperService.dashboards(force).then((result) => {
            this.dashboards = result;
            this.collapseTab();
        });
    }

    public getImageUrl(): string {
        return this.isAuthenticated() ? this.principal.getImageUrl() : null;
    }

    public isNotMobileMenu(): boolean {
        return $(window).width() < 991;
    }

    public ngAfterViewInit(): void {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        if ($('body').hasClass('sidebar-mini')) {
            misc.sidebarMiniActive = true;
        }
        $('#minimizeSidebar').click(() => {

            if (misc.sidebarMiniActive === true) {
                $('body').removeClass('sidebar-mini');
                misc.sidebarMiniActive = false;

            } else {
                setTimeout(() => {
                    $('body').addClass('sidebar-mini');

                    misc.sidebarMiniActive = true;
                }, 300);
            }

            // we simulate the window Resize so the charts will get updated in realtime.
            const simulateWindowResize = setInterval(() => {
                window.dispatchEvent(new Event('resize'));
            }, 180);

            // we stop the simulation of Window Resize after the animations are completed
            setTimeout(() => {
                clearInterval(simulateWindowResize);
            }, 1000);
        });
    }

    public getDashboardName(dashboard: Dashboard): string {
        let name = dashboard.name;
        if (dashboard.config && dashboard.config.name) {
            name = dashboard.config.name;
        }
        if (dashboard.config && dashboard.config.menu && dashboard.config.menu.name) {
            name = dashboard.config.menu.name;
        }
        return this.i18nNamePipe.transform(name, this.principal);
    }

    public getDashboardIcon(dashboard: Dashboard): string {
        let icon = '';
        if (dashboard && dashboard.config && dashboard.config.icon) {
            if (dashboard.config.icon === 'no-icon') {
                icon = '';
            } else {
                icon = `<i class="material-icons m-0 w-30" style="width: 30px;">${dashboard.config.icon}</i>`;
            }
        } else {
            icon = this.getDashboardName(dashboard).charAt(0);
        }
        return icon;
    }

    public getApplicationName(application: any): string {
        const name = application.pluralName ? application.pluralName : application.name;
        return this.i18nNamePipe.transform(name, this.principal);
    }

    private registerLogoutEvent(): void {
        this.logoutSubscribtion = this.eventManager.subscribe(XM_EVENT_LIST.XM_LOGOUT, () => {
            this.logout(true);
        });
    }

    private registerUnauthorized(): void {
        this.unauthSubscription = this.eventManager.subscribe(XM_EVENT_LIST.XM_UNAUTHORIZED, () => {
            this.logout(true);
        });
    }

    private registerChangeAuth(): void {
        this.authSubscription = this.eventManager.subscribe(XM_EVENT_LIST.XM_SUCCESS_AUTH, () => {
            this.loadData();
            // this.router.navigate([`/dashboard`, result[0].id])
        });
    }

    private registerChangeInDashboards(): void {
        this.dashboardSubscription = this.eventManager.subscribe(XM_EVENT_LIST.XM_DASHBOARD_LIST_MODIFICATION,
            () => this.getDashboards(true));
    }

    // tslint:disable-next-line:cognitive-complexity
    private loadData(): void {
        // optimization, load data only if it is empty;
        if (!this.dashboards || this.dashboards.length === 0) {
            this.principal.hasPrivileges(['XMENTITY_SPEC.GET'])
                .then((result) => {
                    if (result && !this.applications) {
                        this.applications = this.xmEntitySpecWrapperService.spec(true).then((spec) => {
                            const applications = spec.types.filter((t) => t.isApp)
                                .filter((t) => this.principal
                                    .hasPrivilegesInline(['APPLICATION.' + t.key]));
                            this.isApplicationExists = applications.length > 0;
                            return applications;
                        });
                        // TODO: this.applications.then(() => this.collapseTab());
                    }
                });

            this.principal.hasPrivileges(['DASHBOARD.GET_LIST'])
                .then((result) => {
                    if (!result) {
                        return;
                    }
                    // no need to load dashboards, if they are loaded
                    this.dashboardWrapperService.dashboards(true).then((dashboards) => {
                        this.dashboards = dashboards;
                        if (dashboards && dashboards.length) {
                            this.dashboards.sort(sortDashboards);
                        }
                        this.groupDashboards();
                        this.collapseTab();
                    });
                });
        }

    }

    private collapseTab(): void {
        setTimeout(() => {
            const sidebarMenuActive = $('.sidebar .nav > li.active > a:not([data-toggle="collapse"])');
            let $sidebarParent;
            let collapseId;

            if (sidebarMenuActive) {($sidebarParent = sidebarMenuActive.parents('.collapse')); }
            if ($sidebarParent) { (collapseId = $sidebarParent.siblings('a').attr('href')); }
            if (collapseId) { $(collapseId).collapse('show'); }

        }, 100);
    }

    // tslint:disable-next-line:cognitive-complexity
    private groupDashboards(): void {
        this.dashboardGroups = [];
        if (!this.dashboards) {
            return;
        }
        for (const dashboard of this.dashboards.filter((d) => this.checkCondition(d))) {
            const menu = dashboard.config && dashboard.config.menu ? dashboard.config.menu : null;
            const groupIsLink = menu && menu.groupIsLink ? menu.groupIsLink : false;
            const orderIndex = menu && menu.group && menu.group.orderIndex ?
                menu.group.orderIndex :
                this.dashboards
                    .filter((d) => this.checkCondition(d))
                    .length + 1;
            let groupKey = !menu ? 'DASHBOARD' : menu.group.key;
            const icon = menu && menu.group && menu.group.icon ? menu.group.icon : null;
            if (groupIsLink) {
                groupKey = dashboard.config && dashboard.config.slug ? dashboard.config.slug : null;
            }
            let group = this.dashboardGroups.filter((g) => g.key === groupKey).shift();
            if (!group) {
                group = {
                    key: groupKey,
                    name: menu && menu.group ? menu.group.name : null,
                    groupIsLink,
                    config: {
                        orderIndex,
                        icon,
                    },
                    dashboards: [],
                };
                this.dashboardGroups.push(group);
                this.dashboardGroups.sort(sortDashboards);
            }
            group.dashboards.push(dashboard);
            this.dashboardGroups.forEach((d) => {
                if (d.dashboards && d.dashboards.length > 0) {
                    d.dashboards.sort(sortDashboards);
                }
            });
        }
    }

    private checkCondition(dashboard: Dashboard): boolean {
        if (dashboard.config && dashboard.config.condition) {
            try {
                return !!(new Function('context', dashboard.config.condition))(this.contextService);
            } catch (e) {
                const code = transpilingForIE(dashboard.config.condition, this.contextService);
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
                catchError(() => {
                    return of();
                }),
            );
    }
}
