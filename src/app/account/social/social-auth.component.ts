import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { AuthService, LoginComponent, LoginService } from '../../shared';
import { StateStorageService } from '../../shared/auth/state-storage.service';
import { XmConfigService } from '../../shared/spec/config.service';
import { XM_EVENT_LIST } from '../../xm.constants';

const SOCIAL_AUTH = 'social-authentication';

@Component({
    selector: 'xm-social-auth',
    templateUrl: '../../shared/login/login.component.html'
})
export class SocialAuthComponent extends LoginComponent implements OnInit {

    constructor(protected eventManager: JhiEventManager,
                protected xmConfigService: XmConfigService,
                protected loginService: LoginService,
                protected stateStorageService: StateStorageService,
                protected elementRef: ElementRef,
                protected router: Router,
                protected alertService: JhiAlertService,
                protected Auth: AuthService,
                protected cookieService: CookieService) {
        super(eventManager, xmConfigService, loginService, stateStorageService, elementRef, router, alertService);
    }

    ngOnInit() {
        const token = this.cookieService.get(SOCIAL_AUTH);
        if (token) {
            this.loginService.loginWithToken(token, false).then(() => {
                this.cookieService.remove(SOCIAL_AUTH);
                this.Auth.authorize(true)
                    .then(
                        () => {
                            this.eventManager.broadcast({name: XM_EVENT_LIST.XM_SUCCESS_AUTH});
                            this.router.navigate(['dashboard']);
                        },
                        () => this.router.navigate([''])
                    );
            }, () => {
                this.router.navigate(['social-register'], {queryParams: {'success': 'false'}});
            });
        }
    }
}
