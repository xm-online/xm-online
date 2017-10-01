import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, LoginService } from '../../shared';
import { CookieService } from 'angular2-cookie/core';
import {EventManager} from "ng-jhipster";

@Component({
    selector: 'xm-auth',
    templateUrl: '../../shared/login/login.component.html'
})
export class SocialAuthComponent implements OnInit {

    constructor(
        private Auth: AuthService,
        private loginService: LoginService,
        private cookieService: CookieService,
        private eventManager: EventManager,
        private router: Router
    ) {
    }

    ngOnInit() {
        let token = this.cookieService.get('social-authentication');
        if (token) {
            this.loginService.loginWithToken(token, false).then(() => {
                this.cookieService.remove('social-authentication');
                this.Auth.authorize(true)
                    .then(
                        () => {
                            this.eventManager.broadcast({name: 'authenticationSuccess'});
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
