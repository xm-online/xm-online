import {Component, OnInit, AfterViewInit, Renderer, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {JhiLanguageService, EventManager} from 'ng-jhipster';

import {LoginService} from './login.service';
import {StateStorageService} from '../auth/state-storage.service';
import {SocialService} from '../social/social.service';
import {XmConfigService} from '../../admin/configuration/config.service';

@Component({
    selector: 'xm-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, AfterViewInit {
    authenticationError: boolean;
    password: string;
    rememberMe: boolean;
    username: string;
    credentials: any;

    socialConfiguration: any = {};

    constructor(private eventManager: EventManager,
                private jhiLanguageService: JhiLanguageService,
                private xmConfigService: XmConfigService,
                private loginService: LoginService,
                private stateStorageService: StateStorageService,
                private elementRef: ElementRef,
                private renderer: Renderer,
                private socialService: SocialService,
                private router: Router) {
        this.jhiLanguageService.addLocation('login');
        this.credentials = {};
        let self = this;
        this.xmConfigService.initSocialConfiguration(function(socialConfiguration) {
            self.socialConfiguration = socialConfiguration;
        });
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#username'), 'focus', []);
    }

    cancel() {
        this.credentials = {
            username: null,
            password: null,
            rememberMe: true
        };
        this.authenticationError = false;
    }

    login() {
        this.loginService.login({
            username: this.username,
            password: this.password,
            rememberMe: this.rememberMe
        }).then(() => {
            this.authenticationError = false;
            if (this.router.url === '/register' || (/activate/.test(this.router.url)) ||
                this.router.url === '/finishReset' || this.router.url === '/requestReset') {
                this.router.navigate(['']);
            }

            this.eventManager.broadcast({
                name: 'authenticationSuccess',
                content: 'Sending Authentication Success'
            });

            // previousState was set in the authExpiredInterceptor before being redirected to login modal.
            // since login is succesful, go to stored previousState and clear previousState
            const redirect = this.stateStorageService.getUrl();
            if (redirect) {
                this.router.navigate([redirect]);
            } else {
                this.router.navigate(['dashboard']);
            }
        }).catch(() => {
            this.authenticationError = true;
        });
    }

    requestResetPassword() {
        this.router.navigate(['/reset', 'request']);
    }
}
