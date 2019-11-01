import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TERMS_ERROR, XM_EVENT_LIST } from '../../xm.constants';
import { StateStorageService } from '../auth/state-storage.service';
import { XmConfigService } from '../spec/config.service';
import { LoginService } from './login.service';
import { PrivacyAndTermsDialogComponent } from '../components/privacy-and-terms-dialog/privacy-and-terms-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare let $: any;

@Component({
    selector: 'xm-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {

    @Input() successRegistration: boolean;
    @Input() loginLabel: string;
    @Input() public config: any;

    isShowPassword = false;
    isDisabled: boolean;
    authenticationError: boolean;
    password: string;
    hideRememberMe: boolean;
    hideResetPasswordLink: boolean;
    rememberMe: boolean;
    username: string;
    credentials: any;
    checkOTP: boolean;
    otpValue: string;
    floatLabel: boolean;
    sendingLogin: boolean;
    socialConfig: [];

    public checkTermsOfConditions: boolean;

    constructor(
        protected eventManager: JhiEventManager,
        protected xmConfigService: XmConfigService,
        protected loginService: LoginService,
        protected stateStorageService: StateStorageService,
        protected elementRef: ElementRef,
        protected router: Router,
        protected alertService: JhiAlertService,
        protected modalService: NgbModal,
    ) {
        this.checkOTP = false;
        this.credentials = {};
        this.otpValue = '';
        this.successRegistration = false;
    }

    ngOnInit() {
        $('body').addClass('xm-public-screen');
        this.isDisabled = false;

        this.getConfigs()
            .pipe(
                map((c) => {
                    return {ui: c[0], uaa: c[1] ? c[1] : null};
                }),
            )
            .subscribe((config) => {
                const uiConfig = config && config.ui;
                const uaaConfig = config && config.uaa;
                this.socialConfig = uiConfig && uiConfig.social;
                this.hideRememberMe = uiConfig.hideRememberMe ? uiConfig.hideRememberMe : false;
                this.hideResetPasswordLink = uiConfig.hideResetPasswordLink ? uiConfig.hideResetPasswordLink : false;
                this.checkTermsOfConditions = uaaConfig && uaaConfig.isTermsOfConditionsEnabled || false;
            });
    }

    ngAfterViewInit() {
        this.fixAutoFillFieldsChrome();
    }

    cancel() {
        this.credentials = {
            username: null,
            password: null,
            rememberMe: true,
        };
        this.authenticationError = false;
        this.successRegistration = false;
    }

    loginSuccess() {
      $('body').removeClass('xm-public-screen');
      if (this.router.url === '/register' || (/activate/.test(this.router.url)) ||
        this.router.url === '/finishReset' || this.router.url === '/requestReset') {
        this.router.navigate(['']);
      }

      this.eventManager.broadcast({
        name: XM_EVENT_LIST.XM_SUCCESS_AUTH,
        content: 'Sending Authentication Success',
      });

      // previousState was set in the authExpiredInterceptor before being redirected to login modal.
      // since login is succesful, go to stored previousState and clear previousState
      const redirect = this.stateStorageService.getUrl();
      if (redirect) {
        this.router.navigate([redirect]);
      } else {
        this.router.navigate(['dashboard']);
      }
    }

    public checkOtp(): void {
      const credentials = {
        grant_type: 'tfa_otp_token',
        otp: this.otpValue,
        rememberMe: this.rememberMe,
      };

      const callBack = () => {};

      this.loginService.login(credentials, callBack).then(() => {
        this.isDisabled = false;
        this.loginSuccess();
      }).catch((err) => {
        this.authenticationError = true;
        this.successRegistration = false;
        this.isDisabled = false;
        this.backToLogin();
      });

    }

    backToLogin() {
      this.checkOTP = false;
      this.stateStorageService.resetAllStates();
      this.password = '';
      this.rememberMe = false;
      this.username = '';
    }

    login() {
        this.sendingLogin = true;
        this.isDisabled = true;
        this.authenticationError = false;
        this.successRegistration = false;
        this.stateStorageService.resetAllStates();
        const credentials = {
          grant_type: 'password',
          username: this.username ? this.username.toLowerCase().trim() : '',
          password: this.password ? this.password.trim() : '',
          rememberMe: this.rememberMe,
        };

        const callBack = () => {};

        this.loginService.login(credentials, callBack).then((data) => {
            this.isDisabled = false;
            this.sendingLogin = false;
            if ('otpConfirmation' === data) {
              this.checkOTP = true;
              this.alertService.info('login.messages.otp.notification');
            } else {
              this.loginSuccess();
            }
        }).catch((err) => {
            const errObj = err.error || null;
            const termsErr =  errObj && errObj.error === TERMS_ERROR;
            const termsToken = errObj.oneTimeToken || null;
            if (termsErr && termsToken) { this.pushTermsAccepting(termsToken); }
            this.authenticationError = !termsErr;
            this.successRegistration = false;
            this.isDisabled = false;
            this.sendingLogin = false;
        });
    }

    requestResetPassword() {
        this.router.navigate(['/reset', 'request']);
    }

    isFormDisabled() {
        return this.isDisabled;
    }

    private fixAutoFillFieldsChrome(): void {
        setTimeout(() => {
            try {
                const autoFilled = document.querySelectorAll('input:-webkit-autofill');
                if (autoFilled) {
                    this.floatLabel = true;
                }
            } catch (e) {
            }
        }, 500);
    }

    private getConfigs(): Observable<any> {
        const ui = this.xmConfigService.getUiConfig();
        const uaa = this.xmConfigService.getPasswordConfig();
        return forkJoin([ui, uaa]);
    }

    private pushTermsAccepting(token: string): void {
        const modalRef = this.modalService.open(PrivacyAndTermsDialogComponent, {size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.config = this.config;
        modalRef.componentInstance.termsToken = token;
        modalRef.result.then((r) => {
            if (r === 'accept') {
                this.login();
            }
        });
    }
}
