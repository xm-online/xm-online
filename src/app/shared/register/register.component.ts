import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { XmEventManager } from '@xm-ngx/core';

import { ReCaptchaComponent } from 'angular2-recaptcha';
import { JhiLanguageService } from 'ng-jhipster';

import { PasswordSpec } from '../../xm-entity/shared/password-spec.model';
import { XM_EVENT_LIST } from '../../xm.constants';
import { PrivacyAndTermsDialogComponent } from '../components/privacy-and-terms-dialog/privacy-and-terms-dialog.component';
import { XmConfigService } from '../spec/config.service';
import { RegisterService } from './register.service';

@Component({
    selector: 'xm-register',
    templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

    @Input() public config: any;
    @ViewChild(ReCaptchaComponent, {static: false}) public captcha: ReCaptchaComponent;

    public email: string;
    public msisdn: string;
    public nickname: string;
    public confirmPassword: string;
    public doNotMatch: string;
    public error: string;
    public errorEmailEmpty: string;
    public errorUserExists: string;
    public captchaRequired: string;
    public registerAccount: any;
    public success: boolean;
    public modalRef: MatDialogRef<any>;
    public needCaptcha: boolean = false;
    public language: string = 'en';
    public publicKey: string;
    public socialConfig: [];
    public passwordSettings: PasswordSpec;
    public patternMessage: string;

    constructor(private jhiLanguageService: JhiLanguageService,
                private xmConfigService: XmConfigService,
                private registerService: RegisterService,
                private eventManager: XmEventManager,
                private modalService: MatDialog) {

        this.jhiLanguageService.getCurrent().then((lang) => {
            this.language = lang;
        });

        this.registerService.isCaptchaNeed().subscribe((result) => {
            this.needCaptcha = result.isCaptchaNeed;
            this.publicKey = result.publicKey;
        });
    }

    public ngOnInit(): void {
        this.success = false;
        this.registerAccount = {};
        this.xmConfigService.getUiConfig().subscribe((config) => {
            this.socialConfig = config && config.social;
        });
        this.xmConfigService
            .getPasswordConfig()
            .subscribe((config: any) => {
                this.makePasswordSettings(config);
            }, () => this.makePasswordSettings());
    }

    public register(): void {
        if (this.registerAccount.password !== this.confirmPassword) {
            this.doNotMatch = 'ERROR';
        } else {
            if (this.config && this.config.privacyAndTermsEnabled) {
                const modalRef = this.modalService.open(PrivacyAndTermsDialogComponent, {
                    width: '500px',
                });
                modalRef.componentInstance.config = this.config;
                modalRef.afterClosed().subscribe((r) => {
                    if (r === 'accept') {
                        this.registration();
                    }
                });
            } else {
                this.registration();
            }
        }
    }

    public handleCorrectCaptcha($event: any): void {
        this.registerAccount.captcha = $event;
        this.captchaRequired = null;
    }

    public handleCaptchaExpired(_$event: any): void {
        this.registerAccount.captcha = null;
    }

    private registration(): void {
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
                    this.eventManager.broadcast({name: XM_EVENT_LIST.XM_REGISTRATION, content: ''});
                },
                (response) => this.processError(response));
        });
    }

    private processError(response: any): void {
        this.success = null;
        if (response.status === 400 && response.error.error === 'error.login.already.used') {
            this.errorUserExists = 'ERROR';
        } else if (response.status === 400 && response.error.error === 'error.captcha.required') {
            this.captchaRequired = 'ERROR';
            this.needCaptcha = true;
            this.registerService.isCaptchaNeed().subscribe((result) => {
                this.publicKey = result.publicKey;
            });
        } else {
            this.error = 'ERROR';
        }
        if (this.captcha) {
            this.captcha.reset();
        }
    }

    private makeLogins(): void {
        this.registerAccount.logins = [];

        // email login
        this.registerAccount.logins.push({
            typeKey: 'LOGIN.EMAIL',
            login: this.email,
        });

        // nickname login
        if (this.nickname) {
            this.registerAccount.logins.push({
                typeKey: 'LOGIN.NICKNAME',
                login: this.nickname,
            });
        }

        // phone number login
        if (this.msisdn) {
            this.registerAccount.logins.push({
                typeKey: 'LOGIN.MSISDN',
                login: this.msisdn,
            });
        }
    }

    private makePasswordSettings(config?: any): void {
        this.passwordSettings = this.xmConfigService.mapPasswordSettings(config);
        if (this.passwordSettings.patternMessage) {
            this.patternMessage = this.xmConfigService.updatePatternMessage(this.passwordSettings.patternMessage);
        }
    }
}
