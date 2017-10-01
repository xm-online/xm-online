import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd, NavigationStart} from '@angular/router';

import { JhiLanguageHelper } from '../../shared';
import {EventManager, JhiLanguageService} from "ng-jhipster";
import {Subscription} from "rxjs/Subscription";
import {Principal} from "../../shared/auth/principal.service";
import { TranslateService } from 'ng2-translate';

declare let $:any;

@Component({
    selector: 'xm-main',
    templateUrl: './main.component.html'
})
export class XmMainComponent implements OnInit {

    showSidebar: boolean = true;
    private authSucessSubscription: Subscription;
    private unauthSubscription: Subscription;
    private excludePaths: Array<string> = ['/reset/finish', '/activate', '/social-auth'];
    private excludePathsForViewSidebar: Array<string> = ['/social-auth'];

    constructor(
        private jhiLanguageHelper: JhiLanguageHelper,
        private jhiLanguageService: JhiLanguageService,
        private router: Router,
        private translateService: TranslateService,
        private principal: Principal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['global']);
        this.registerAuthenticationSuccess();
        this.registerUnauthorized();
    }

    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        let isWindows = navigator.platform.indexOf('Win') > -1;
        if (isWindows){
            // if we are on windows OS we activate the perfectScrollbar function
            body.classList.add("perfect-scrollbar-on");
        } else {
            body.classList.add("perfect-scrollbar-off");
        }

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.showSidebar = this.excludePathsForViewSidebar.indexOf(event.url) == -1;
            }
            if (event instanceof NavigationEnd) {
                this.jhiLanguageHelper.updateTitle();

                this.updateLang();
            }
        });

        $.material.init();
    }

    private updateLang() {
        let langKey = this.principal.getLangKey();
        if (langKey) {
            console.log(langKey);
            this.jhiLanguageService.changeLanguage(langKey);
            this.jhiLanguageHelper.getAll().then(langs => {
                if (langs && langs.length > 0 && langs.filter(lang => lang == langKey).length == 0) {
                    console.log("Currect user lang in not configured in this tenant. Lang set to " + langs[0]);
                    this.jhiLanguageService.changeLanguage(langs[0]);
                }
            });
        } else {
            this.jhiLanguageHelper.getAll().then(langs => {
                if (langs && langs.length > 0) {
                    console.log(langs[0]);
                    this.jhiLanguageService.changeLanguage(langs[0]);
                }
            });
        }
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.authSucessSubscription);
        this.eventManager.destroy(this.unauthSubscription);
    }

    private registerAuthenticationSuccess() {
        this.authSucessSubscription = this.eventManager.subscribe('authenticationSuccess', (message) => this.principal.identity());
    }

    private registerUnauthorized() {
        this.unauthSubscription = this.eventManager.subscribe('xm.unauthorized', (response) => {
            $("ngb-modal-window").click();
            const path = this.router.routerState.snapshot.url;
            for (const exPath of this.excludePaths) {
                if (path.startsWith(exPath)) {
                    return;
                }
            }
            this.router.navigate(['']);
        });
    }

}
