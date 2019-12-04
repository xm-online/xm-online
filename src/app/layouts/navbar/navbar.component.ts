import { Location } from '@angular/common';
import {
    Component,
    DoCheck,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';

import { iif, Observable, of, Subscription } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { JhiLanguageHelper, LANGUAGES, Principal } from '../../shared';
import { XmConfigService } from '../../shared/spec/config.service';
import { DashboardWrapperService } from '../../xm-dashboard';
import { DEBUG_INFO_ENABLED, VERSION, XM_EVENT_LIST } from '../../xm.constants';

const misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
};

declare let $: any;

@Component({
    selector: 'xm-navbar',
    styleUrls: ['./navbar.component.scss'],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy, DoCheck {

    private changeLanguageSubscriber: Subscription;

    routeData: any = {};
    languages: any[];
    modalRef: NgbModalRef;
    version: string;
    tenantName: string;
    mobile_menu_visible: any = 0;
    title: string;
    titleContent: string;
    tenantLogoUrl: '../assets/img/logo-xm-online.png';
    public searchMask = '';

    private previousPath: string;
    private backStep = 0;
    private toggleButton;
    private sidebarVisible: boolean;

    @ViewChild('navbar-cmp', {static: false}) button;

    constructor(private languageHelper: JhiLanguageHelper,
                private jhiLanguageService: JhiLanguageService,
                private principal: Principal,
                private router: Router,
                private translateService: TranslateService,
                private element: ElementRef,
                private eventManager: JhiEventManager,
                private $sessionStorage: SessionStorageService,
                private location: Location,
                private xmConfigService: XmConfigService,
                private dashboardWrapperService: DashboardWrapperService) {
        this.version = DEBUG_INFO_ENABLED ? 'v' + VERSION : '';
        this.registerPopState();

        this.sidebarVisible = false;
    }

    public ngOnInit(): void {
        this.changeLanguageSubscriber = this.eventManager.subscribe(XM_EVENT_LIST.XM_CHANGE_LANGUAGE, (event) => {
            this.jhiLanguageService.changeLanguage(event.content);
        });
        this.xmConfigService.getUiConfig().subscribe((result) => {
            this.tenantName = result['name'] ? result['name'] : 'XM^online';
            if (this.tenantName === 'XM^online') {
                this.tenantName += ' ' + this.version;
            }
            $('#favicon').attr('href', result['favicon'] ? result['favicon'] : './assets/img/favicon.png');
            if (result['logoUrl']) {
                this.tenantLogoUrl = result['logoUrl'];
            }
            this.languageHelper.getAll().then((languages) => {
                this.languages = (result && result.langs) ? result.langs : languages;
            });
        });

        this.routeData = this.getRouteData(this.router.routerState.snapshot.root);

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.routeData = this.getRouteData(this.router.routerState.snapshot.root);

                if (this.getDashboardId()) {
                    this.getSearchMask().pipe(
                        tap((mask) => this.searchMask = mask),
                    ).subscribe();
                }
            }
        });

        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        if ($('body').hasClass('sidebar-mini')) {
            misc.sidebar_mini_active = true;
        }
        $('#minimizeSidebar').click(function () {

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

    public ngOnDestroy(): void {
        this.changeLanguageSubscriber.unsubscribe();
    }

    public ngDoCheck(): void {
        this.processTitle(this.routeData);
    }

    public search(term: string): void {
        if (term) {
            this.router.navigate(['/search'], {queryParams: {query: term, dashboardId: this.getDashboardId()}});
        }
    }

    public changeLanguage(languageKey: string): void {
        this.jhiLanguageService.changeLanguage(languageKey);
        this.translateService.getTranslation(languageKey).subscribe((res) => {
            LANGUAGES.forEach((lang) => {
                this.$sessionStorage.clear(lang);
            });
            this.$sessionStorage.store(languageKey, JSON.stringify(res));
            this.$sessionStorage.store('currentLang', languageKey);
        });
        this.eventManager.broadcast({name: 'changeLanguage', content: languageKey});
    }

    public isAuthenticated(): boolean {
        return this.principal.isAuthenticated();
    }

    public isMobileMenu(): boolean {
        return $(window).width() > 991;
    }

    public sidebarToggle(): void {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    }

    public sidebarOpen(): void {
        const _this = this;
        const $toggle = document.getElementsByClassName('navbar-toggler')[0];
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function() {
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');
        setTimeout(function() {
            $toggle.classList.add('toggled');
        }, 430);

        const $layer = document.createElement('div');
        $layer.setAttribute('class', 'close-layer');

        if (body.querySelectorAll('.main-panel')) {
            document.getElementsByClassName('main-panel')[0].appendChild($layer);
        } else if (body.classList.contains('off-canvas-sidebar')) {
            document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
        }

        setTimeout(function() {
            $layer.classList.add('visible');
        }, 100);

        $layer.onclick = function() {
            body.classList.remove('nav-open');
            _this.mobile_menu_visible = 0;
            _this.sidebarVisible = false;

            $layer.classList.remove('visible');
            setTimeout(function() {
                $layer.remove();
                $toggle.classList.remove('toggled');
            }, 400);
        }.bind(this);

        body.classList.add('nav-open');
        this.mobile_menu_visible = 1;
        this.sidebarVisible = true;
    }

    public sidebarClose(): void {
        const $toggle = document.getElementsByClassName('navbar-toggler')[0];
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        const $layer = document.createElement('div');
        $layer.setAttribute('class', 'close-layer');

        this.sidebarVisible = false;
        body.classList.remove('nav-open');
        if ($layer) {
            $layer.remove();
        }

        setTimeout(function() {
            $toggle.classList.remove('toggled');
        }, 400);

        this.mobile_menu_visible = 0;
    }

    public onBack(): void {
        this.previousPath = this.location.path();
        this.location.back();
    }

    private getSearchMask(): Observable<string> {
        const condition = (dash) =>  !!(dash && dash.config && dash.config.search && dash.config.search.mask);
        const expr = (dash) => of((dash && dash.config && dash.config.search && dash.config.search.mask));
        const f$ = of('');
        return this.dashboardWrapperService.getDashboardByIdOrSlug(this.getDashboardId())
            .pipe(
                // get 1 or '' depending from condition
                mergeMap((dashboard) => iif(() => condition(dashboard), expr(dashboard), f$)),
            );
    }

    private getRouteData(routeSnapshot: ActivatedRouteSnapshot): string {
        let rData;

        if (routeSnapshot.data) {
            rData = routeSnapshot.data;
        }

        if (routeSnapshot.firstChild) {
            rData = this.getRouteData(routeSnapshot.firstChild) || this.routeData;
        }

        return rData;
    }

    private registerPopState(): void {
        this.location.subscribe(() => {
            if (this.location.isCurrentPathEqualTo(this.previousPath)) {
                if (++this.backStep < 10) {
                    this.onBack();
                } else {
                    this.backStep = 0;
                }
            }
        });
    }

    private processTitle(routData: any): void {
        let titlePart1 = this.translateOrEmpty(routData.pageTitle);
        let titlePart2 = routData.pageSubTitle || routData.pageSubTitleTrans ? ' - ' : '';
        let titlePart3 = routData.pageSubTitle ? routData.pageSubTitle : '';
        let titlePart4 = this.translateOrEmpty(routData.pageSubTitleTrans);
        let titlePart5 = routData.pageSubSubTitle || routData.pageSubSubTitleTrans ? ' - ' : '';
        let titlePart6 = routData.pageSubSubTitle ? routData.pageSubSubTitle : '';
        let titlePart7 = this.translateOrEmpty(routData.pageSubSubTitleTrans);
        this.title = titlePart1 + titlePart2 + titlePart3 + titlePart4 + titlePart5 + titlePart6 + titlePart7;
        titlePart1 = `<span class="title-part-1">${titlePart1}</span>`;
        titlePart2 = `<span class="title-part-2">${titlePart2}</span>`;
        titlePart3 = `<span class="title-part-3">${titlePart3}</span>`;
        titlePart4 = `<span class="title-part-4">${titlePart4}</span>`;
        titlePart5 = `<span class="title-part-5">${titlePart5}</span>`;
        titlePart6 = `<span class="title-part-6">${titlePart6}</span>`;
        titlePart7 = `<span class="title-part-7">${titlePart7}</span>`;
        this.titleContent = titlePart1 + titlePart2 + titlePart3 + titlePart4 + titlePart5 + titlePart6 + titlePart7;
    }

    private translateOrEmpty(item: string): string {
        return item ? this.translateService.instant(item) : '';
    }

    private getDashboardId(): number | string {
        if (this.location.path(false).includes('dashboard')) {
            const url = this.location.path(false).split('/');
            return  url[url.indexOf('dashboard') + 1];
        }
        return null;
    }
}
