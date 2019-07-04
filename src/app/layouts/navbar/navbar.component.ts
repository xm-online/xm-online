import { Location } from '@angular/common';
import {
    Component,
    DoCheck,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';

import { XmConfigService } from '../../shared/spec/config.service';
import { JhiLanguageHelper, LANGUAGES, Principal } from '../../shared';
import { DEBUG_INFO_ENABLED, VERSION } from '../../xm.constants';

const misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0
};

declare let $: any;

@Component({
    selector: 'xm-navbar',
    styleUrls: ['./navbar.component.scss'],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy, DoCheck {

    routeData: any = {};
    languages: any[];
    modalRef: NgbModalRef;
    version: string;
    tenantName: string;
    mobile_menu_visible: any = 0;
    title: string;
    titleContent: string;
    tenantLogoUrl: '../assets/img/logo-xm-online.png';
    private nativeElement: Node;
    private previousPath: string;
    private backStep = 0;
    private toggleButton;
    private sidebarVisible: boolean;

    @ViewChild('navbar-cmp') button;

    constructor(private languageHelper: JhiLanguageHelper,
                private jhiLanguageService: JhiLanguageService,
                private principal: Principal,
                private router: Router,
                private translateService: TranslateService,
                private element: ElementRef,
                private eventManager: JhiEventManager,
                private $sessionStorage: SessionStorageService,
                private location: Location,
                private xmConfigService: XmConfigService) {
        this.version = DEBUG_INFO_ENABLED ? 'v' + VERSION : '';
        this.registerPopState();
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.xmConfigService.getUiConfig().subscribe(result => {
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
            }
        });
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
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

    ngOnDestroy() {
    }

    ngDoCheck() {
        this.processTitle(this.routeData);
    }

    search(term: string) {
        if (term) {
            this.router.navigate(['/search'], {queryParams: { query: term}});
        }

    }

    changeLanguage(languageKey: string) {
        this.jhiLanguageService.changeLanguage(languageKey);
        this.translateService.getTranslation(languageKey).subscribe((res) => {
            LANGUAGES.forEach((lang) => {
                this.$sessionStorage.clear(lang);
            });
            this.$sessionStorage.store(languageKey, JSON.stringify(res));
            this.$sessionStorage.store('currentLang', languageKey);
        });
        this.eventManager.broadcast({name: 'changeLanguage', content: languageKey})
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    isMobileMenu() {
        return $(window).width() > 991;
    }

    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    }

    sidebarOpen() {
        const _this = this;
        const $toggle = document.getElementsByClassName('navbar-toggler')[0];
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
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
    };

    sidebarClose() {
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
    };

    onBack() {
        this.previousPath = this.location.path();
        this.location.back();
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


    private registerPopState() {
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
        let titlePart1, titlePart2, titlePart3, titlePart4, titlePart5, titlePart6, titlePart7;
        titlePart1 = routData.pageTitle ?  this.translateService.instant(routData.pageTitle) : '';
        titlePart2 = routData.pageSubTitle || routData.pageSubTitleTrans ? ' - ' : '';
        titlePart3 = routData.pageSubTitle ? routData.pageSubTitle : '';
        titlePart4 = routData.pageSubTitleTrans ?  this.translateService.instant(routData.pageSubTitleTrans) : '';
        titlePart5 = routData.pageSubSubTitle || routData.pageSubSubTitleTrans ? ' - ' : '';
        titlePart6 = routData.pageSubSubTitle ? routData.pageSubSubTitle : '';
        titlePart7 = routData.pageSubSubTitleTrans ? this.translateService.instant(routData.pageSubSubTitleTrans) : '';
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
}
