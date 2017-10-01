import {Component, OnInit, AfterViewInit, Renderer, ElementRef, ViewChild} from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {JhiLanguageService, EventManager} from 'ng-jhipster';

import {Subscription} from 'rxjs/Subscription';
import { RegisterService } from './register.service';
import {ReCaptchaComponent} from 'angular2-recaptcha';
import {XmConfigService} from '../../admin/configuration/config.service';

@Component({
    selector: 'xm-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit, AfterViewInit {

    @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

    email: string;
    msisdn: string;
    nickname: string;
    confirmPassword: string;
    doNotMatch: string;
    error: string;
    errorEmailEmpty: string;
    errorUserExists: string;
    captchaRequired: string;
    registerAccount: any;
    success: boolean;
    modalRef: NgbModalRef;
    needCaptcha = false;
    language = 'en';
    publicKey;


    socialConfiguration: any = {};

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private xmConfigService: XmConfigService,
        private registerService: RegisterService,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private eventManager: EventManager
    ) {
        let self = this;
        this.jhiLanguageService.addLocation('register');

        this.jhiLanguageService.getCurrent().then(lang => {
            self.language = lang;
        });
        this.registerService.isCaptchaNeed().subscribe(result => {
            let json = result.json();
            console.log(result, json);
            this.needCaptcha = json.isCaptchaNeed;
            this.publicKey = json.publicKey;
        });

        this.xmConfigService.initSocialConfiguration(function(socialConfiguration) {
            self.socialConfiguration = socialConfiguration;
        });
    }

    ngOnDestroy() {
    }



    ngOnInit() {
        this.success = false;
        this.registerAccount = {};
    }

    ngAfterViewInit() {
        let htmlEl = this.elementRef.nativeElement.querySelector('#login');
        htmlEl && this.renderer.invokeElementMethod(htmlEl, 'focus', []);
    }

    register() {
        if (this.registerAccount.password !== this.confirmPassword) {
            this.doNotMatch = 'ERROR';
        } else {
            this.doNotMatch = null;
            this.error = null;
            this.errorUserExists = null;
            this.errorEmailEmpty = null;
            this.captchaRequired = null;
            this.jhiLanguageService.getCurrent().then((key) => {
                this.registerAccount.langKey = key;
                this.makeLogins();
                this.registerService.save(this.registerAccount).subscribe(() => {
                    this.success = true;
                }, (response) => this.processError(response));
            });
        }
    }

    handleCorrectCaptcha($event) {
        this.registerAccount.captcha = $event;
        this.captchaRequired = null;
    }

    handleCaptchaExpired($event) {
        this.registerAccount.captcha = null;
    }

    private processError(response) {
        this.success = null;
        console.log(response);
        if (response.status === 400 && response._body === 'Login already in use') {
            this.errorUserExists = 'ERROR';
        } else if (response.status === 400 && response._body === 'Email can\'t be empty') {
            this.errorEmailEmpty = 'ERROR';
        } else if (response.status === 400 && response.json().error === 'error.captcha.required') {
            this.captchaRequired = 'ERROR';
            this.needCaptcha = true;
            this.registerService.isCaptchaNeed().subscribe(result => {
                this.publicKey = result.json().publicKey;
            });
        } else {
            this.error = 'ERROR';
        }
        if (this.captcha) this.captcha.reset();
    }

    private makeLogins() {
        this.registerAccount.logins = [];

        // email login
        this.registerAccount.logins.push({
            typeKey: "LOGIN.EMAIL",
            login: this.email
        });

        // nickname login
        if (this.nickname) {
            this.registerAccount.logins.push({
                typeKey: "LOGIN.NICKNAME",
                login: this.nickname
            });
        }

        // phone number login
        if (this.msisdn) {
            this.registerAccount.logins.push({
                typeKey: "LOGIN.MSISDN",
                login: this.msisdn
            });
        }
    }
}
