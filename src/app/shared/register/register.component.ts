import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';

import { XM_EVENT_LIST } from '../../xm.constants';
import { PrivacyAndTermsDialogComponent } from '../components/privacy-and-terms-dialog/privacy-and-terms-dialog.component';
import { XmConfigService } from '../spec/config.service';
import { RegisterService } from './register.service';
import { PasswordSpec } from '../../xm-entity/shared/password-spec.model';

@Component({
    selector: 'xm-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() config: any;
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
    socialConfig: [];
    passwordSettings: PasswordSpec;
    patternMessage: string;

    constructor(private jhiLanguageService: JhiLanguageService,
                private xmConfigService: XmConfigService,
                private registerService: RegisterService,
                private eventManager: JhiEventManager,
                private modalService: NgbModal) {

        this.jhiLanguageService.getCurrent().then(lang => {
            this.language = lang;
        });

        this.registerService.isCaptchaNeed().subscribe(result => {
            this.needCaptcha = result.isCaptchaNeed;
            this.publicKey = result.publicKey;
        });
    }

    ngOnDestroy() {
    }


    ngOnInit() {
        this.success = false;
        this.registerAccount = {};
        this.xmConfigService.getUiConfig().subscribe(config => {
            this.socialConfig = config && config.social;
        });
        this.xmConfigService
            .getPasswordConfig()
            .subscribe((config: any) => {
                this.makePasswordSettings(config);
            }, err => this.makePasswordSettings());
    }

    ngAfterViewInit() {
    }

    register() {
        if (this.registerAccount.password !== this.confirmPassword) {
            this.doNotMatch = 'ERROR';
        } else {
            if (this.config && this.config.privacyAndTermsEnabled) {
                const modalRef = this.modalService.open(PrivacyAndTermsDialogComponent, {size: 'lg', backdrop: 'static'});
                modalRef.componentInstance.config = this.config;
                modalRef.result.then(r => {
                    if (r === 'accept') {
                        this.registration();
                    }
                }).catch(err => {
                    console.log(err);
                });
            } else {
                this.registration();
            }
        }
    }

    private registration() {
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
                    this.eventManager.broadcast({name: XM_EVENT_LIST.XM_REGISTRATION, content: ''})
                },
                (response) => this.processError(response));
        });
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
        if (response.status === 400 && response.error.error === 'error.login.already.used') {
            this.errorUserExists = 'ERROR';
        } else if (response.status === 400 && response.error.error === 'error.captcha.required') {
            this.captchaRequired = 'ERROR';
            this.needCaptcha = true;
            this.registerService.isCaptchaNeed().subscribe(result => {
                this.publicKey = result.publicKey;
            });
        } else {
            this.error = 'ERROR';
        }
        if (this.captcha) {this.captcha.reset()};
    }

    private makeLogins() {
        this.registerAccount.logins = [];

        // email login
        this.registerAccount.logins.push({
            typeKey: 'LOGIN.EMAIL',
            login: this.email
        });

        // nickname login
        if (this.nickname) {
            this.registerAccount.logins.push({
                typeKey: 'LOGIN.NICKNAME',
                login: this.nickname
            });
        }

        // phone number login
        if (this.msisdn) {
            this.registerAccount.logins.push({
                typeKey: 'LOGIN.MSISDN',
                login: this.msisdn
            });
        }
    }

    private makePasswordSettings(config?: any): void {
        this.passwordSettings = this.xmConfigService.mapPasswordSettings(config);
        if (this.passwordSettings.patternMessage) {
            this.patternMessage = this.xmConfigService.updatePatternMessage(this.passwordSettings.patternMessage)
        }
    }
}
