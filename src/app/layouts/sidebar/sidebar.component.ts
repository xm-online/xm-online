import {Component, OnInit, ViewChild, Renderer, ElementRef} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {LoginService} from '../../shared/login/login.service';
import {JhiLanguageHelper} from '../../shared/language/language.helper';
import {JhiLanguageService, EventManager} from 'ng-jhipster';
import {XmEntitySpecService} from '../../shared/spec/spec.service';
import {Principal} from '../../shared/auth/principal.service';
import {ProfileService} from '../profiles/profile.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {DEBUG_INFO_ENABLED, VERSION} from '../../xm.constants';
import {Response} from '@angular/http';
import {DashboardService} from '../../entities/dashboard/dashboard.service';
import {Dashboard} from '../../entities/dashboard/dashboard.model';
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {XmConfigService} from "../../admin/configuration/config.service";


let misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
};

declare let $: any;
let sidebarTimer;

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {

    inProduction: boolean;
    isNavbarCollapsed: boolean;
    languages: any[];
    swaggerEnabled: boolean;
    modalRef: NgbModalRef;
    version: string;
    applications: Promise<any[]>;
    dashboards: any[];
    location: Location;
    private toggleButton;
    private authSubscription: Subscription;
    private dashboardSubscription: Subscription;

    tenantName: string = "XM^online";
    tenantLogoUrl: string = "../assets/img/logo-xm-online.png";

    @ViewChild('navbar-cmp') button;

    constructor(private loginService: LoginService,
                private languageHelper: JhiLanguageHelper,
                private jhiLanguageService: JhiLanguageService,
                private entitySpecService: XmEntitySpecService,
                private principal: Principal,
                private profileService: ProfileService,
                private router: Router,
                private element: ElementRef,
                private dashboardService: DashboardService,
                private xmConfigService: XmConfigService,
                private eventManager: EventManager) {
        this.version = DEBUG_INFO_ENABLED ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
        this.jhiLanguageService.addLocation('home');

        this.registerChangeAuth();
        this.registerChangeInDashboards();
    }

    ngOnInit() {
        this.languageHelper.getAll().then((languages) => {
            this.languages = languages;
        });


        this.xmConfigService.getUiConfig().subscribe(result => {
            if (result['logoUrl']) {
                this.tenantLogoUrl = result['logoUrl'];
            }
            if (result['name']) {
                this.tenantName = result['name'];
            }

            this.tenantName = this.tenantName ? this.tenantName : "XM^online";
            if (this.tenantName === "XM^online") {
                this.tenantName += " " + this.version;
            }
        });

        this.principal.identity().then(result => this.loadData());
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.authSubscription);
        this.eventManager.destroy(this.dashboardSubscription);
    }

    private registerChangeAuth() {
        this.authSubscription = this.eventManager.subscribe('authenticationSuccess', resp => this.loadData());
    }

    private registerChangeInDashboards() {
        this.dashboardSubscription = this.eventManager.subscribe('dashboardListModification', resp => this.getDashboards());
    }

    private loadData() {
        this.profileService.getProfileInfo().subscribe((profileInfo) => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });

        this.applications = this.entitySpecService.getAll({filter: 'APP'});
        this.applications.then(() => this.collapseTab());
        this.dashboardService.getAll().subscribe((result) => {
                this.dashboards = result;
                this.collapseTab();
            });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    logout() {
        this.loginService.logout();
        this.router.navigate(['']);
    }

    getDashboards() {
        this.dashboardService.getAll().subscribe((result) => {
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
            let sidebarMenuActive = $('.sidebar .nav-container .nav > li.active > a:not([data-toggle="collapse"])'),
                $sidebarParent, collapseId
            ;
            sidebarMenuActive && ($sidebarParent = sidebarMenuActive.parents('.collapse'));
            $sidebarParent && (collapseId = $sidebarParent.siblings('a').attr('href'));
            collapseId && $(collapseId).collapse('show');
        }, 100);
    }

    ngAfterViewInit() {
        let navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        if ($('body').hasClass('sidebar-mini')) {
            misc.sidebar_mini_active = true;
        }
        $('#minimizeSidebar').click(function () {
            let $btn = $(this);

            if (misc.sidebar_mini_active == true) {
                $('body').removeClass('sidebar-mini');
                misc.sidebar_mini_active = false;

            } else {
                setTimeout(function () {
                    $('body').addClass('sidebar-mini');

                    misc.sidebar_mini_active = true;
                }, 300);
            }

            // we simulate the window Resize so the charts will get updated in realtime.
            let simulateWindowResize = setInterval(function () {
                window.dispatchEvent(new Event('resize'));
            }, 180);

            // we stop the simulation of Window Resize after the animations are completed
            setTimeout(function () {
                clearInterval(simulateWindowResize);
            }, 1000);
        });

        let isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        if (isWindows) {
            // if we are on windows OS we activate the perfectScrollbar function
            let $sidebar = $('.sidebar-wrapper');
            $sidebar.perfectScrollbar();
        }
        isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

        if (isWindows) {
            // if we are on windows OS we activate the perfectScrollbar function
            $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
            $('html').addClass('perfect-scrollbar-on');
        } else {
            $('html').addClass('perfect-scrollbar-off');
        }
    }
}