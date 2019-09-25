import { HttpClient, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthServerProvider } from '../../../shared';
import { XmConfigService } from '../../../shared/spec/config.service';
import { PasswordSpec } from '../../../xm-entity/shared/password-spec.model';
import { DEFAULT_AUTH_TOKEN, DEFAULT_CONTENT_TYPE } from '../../../xm.constants';
import { PasswordResetFinish } from './password-reset-finish.service';

interface IResetPasswordFormConfig {
    formTitle: string;
    formMessageInfo: string;
    formMessageError: string;
    formMessageSuccess: string;
    formButtonLabel: string;
}

@Component({
    selector: 'xm-password-reset-finish',
    templateUrl: './password-reset-finish.component.html',
})
export class PasswordResetFinishComponent implements OnInit, AfterViewInit {
    public confirmPassword: string;
    public doNotMatch: string;
    public error: string;
    public keyMissing: boolean;
    public keyExpired: boolean;
    public keyUsed: boolean;
    public resetAccount: any;
    public success: string;
    public modalRef: NgbModalRef;
    public key: string;
    public config: IResetPasswordFormConfig;
    public passwordSettings: PasswordSpec;
    public patternMessage: string;

    @ViewChild('passwordInputElement', {static: false}) passwordInputElement: MatInput;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private passwordResetFinish: PasswordResetFinish,
        private route: ActivatedRoute,
        private http: HttpClient,
        private authServerProvider: AuthServerProvider,
        private xmConfigService: XmConfigService,
        private router: Router,
    ) {
        this.config = {
            formTitle: 'reset.finish.title',
            formMessageInfo: 'reset.finish.messages.info',
            formMessageError: 'reset.finish.messages.error',
            formMessageSuccess: 'reset.finish.messages.success',
            formButtonLabel: 'reset.finish.form.button',
        };
    }

    public ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.key = params['key'];

            this.passwordResetFinish.check(this.key).subscribe(
                (resp) => {}, (err) => {
                    if (err.error && err.error.error) {
                        this.keyExpired = (err.error.error === 'error.reset.code.expired');
                        this.keyUsed = (err.error.error === 'error.reset.code.used');
                    }
            });
        });
        this.route.data.subscribe((data) => {
            if (data && data.config) {
                this.config = {
                    formTitle: data.config.formTitle,
                    formMessageInfo: data.config.formMessageInfo,
                    formMessageError: data.config.formMessageError,
                    formMessageSuccess: data.config.formMessageSuccess,
                    formButtonLabel: data.config.formButtonLabel,
                };
            }
        });
        this.getAccessToken().subscribe(() => {
            this.checkPasswordSettings();
        });
        this.resetAccount = {};
        this.keyMissing = !this.key;
    }


    public ngAfterViewInit(): void {
        setTimeout(() => this.passwordInputElement.focus(), 0);
    }

    public finishReset(): void {
        this.doNotMatch = null;
        this.error = null;
        if (this.resetAccount.password !== this.confirmPassword) {
            this.doNotMatch = 'ERROR';
        } else {
            this.passwordResetFinish.save({key: this.key, newPassword: this.resetAccount.password}).subscribe(() => {
                this.success = 'OK';
            }, () => {
                this.success = null;
                this.error = 'ERROR';
            });
        }
    }

    public login(): void {
        this.router.navigate(['']);
    }

    private checkPasswordSettings(): void {
        this.xmConfigService
            .getPasswordConfig()
            .subscribe((config: any) => {
                this.makePasswordSettings(config);
            }, (err) => this.makePasswordSettings());
    }

    private getAccessToken(): Observable<any> {
        const data = new HttpParams().set('grant_type', 'client_credentials');
        const headers = {
            'Content-Type': DEFAULT_CONTENT_TYPE,
            'Authorization': DEFAULT_AUTH_TOKEN,
        };
        return this.http.post<any>('uaa/oauth/token', data, {headers, observe: 'response'})
            .pipe(map((resp) => {
                this.authServerProvider.loginWithToken(resp.body.access_token, false);
            }));
    }

    private makePasswordSettings(config?: any): void {
        this.passwordSettings = this.xmConfigService.mapPasswordSettings(config);
        if (this.passwordSettings.patternMessage) {
            this.patternMessage = this.xmConfigService.updatePatternMessage(this.passwordSettings.patternMessage);
        }
    }
}
