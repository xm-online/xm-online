import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {Subscription} from 'rxjs/Subscription';
import {EventManager, JhiLanguageService} from 'ng-jhipster';

import {ProfileService} from '../profiles/profile.service'; // FIXME barrel doesn't work here
import {JhiLanguageHelper, Principal} from '../../shared';

import {VERSION, DEBUG_INFO_ENABLED} from '../../xm.constants';

const misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
};

declare let $: any;

@Component({
    selector: 'xm-navbar',
    templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {

    title: string;
    inProduction: boolean;
    languages: any[];
    swaggerEnabled: boolean;
    modalRef: NgbModalRef;
    version: string;
    private previousPath: string;
    private backStep: number = 0;
    private toggleButton;
    private sidebarVisible: boolean;
    private pageTitleSubscription: Subscription;

    @ViewChild('navbar-cmp') button;

    constructor(
        private languageHelper: JhiLanguageHelper,
        private jhiLanguageService: JhiLanguageService,
        private principal: Principal,
        private profileService: ProfileService,
        private router: Router,
        private element: ElementRef,
        private eventManager: EventManager,
        private location: Location,
    ) {
        this.version = DEBUG_INFO_ENABLED ? 'v' + VERSION : '';
        this.jhiLanguageService.addLocation('navbar');
        this.registerChangeInPageTitle();
        this.registerPopState();
    }

    ngOnInit() {
        this.languageHelper.getAll().then((languages) => {
            this.languages = languages;
        });

        this.profileService.getProfileInfo().subscribe((profileInfo) => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });

        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        if ($('body').hasClass('sidebar-mini')) {
            misc.sidebar_mini_active = true;
        }
        $('#minimizeSidebar').click(function () {
            const $btn = $(this);

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
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.pageTitleSubscription);
    }

    search(term: string) {
        this.router.navigateByUrl('/search?query=' + term);
    }

    changeLanguage(languageKey: string) {
        this.jhiLanguageService.changeLanguage(languageKey);
        this.eventManager.broadcast({ name: 'changeLanguage', content: languageKey})
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    isMobileMenu() {
        return $(window).width() > 991;
    }

    sidebarToggle() {
        let toggleButton = this.toggleButton;
        let body = document.getElementsByTagName('body')[0];

        if (this.sidebarVisible) {
            toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        } else {
            setTimeout(function () {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        }
    }

    onBack() {
        this.previousPath = this.location.path();
        this.location.back();
    }

    private registerChangeInPageTitle() {
        this.pageTitleSubscription = this.eventManager.subscribe('pageTitleModification', resp => this.title = resp.content);
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
}
