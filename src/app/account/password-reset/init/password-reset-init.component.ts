import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { ModulesLanguageHelper } from '../../../shared';
import { XM_EVENT_LIST } from '../../../xm.constants';
import { PasswordResetInit } from './password-reset-init.service';

@Component({
    selector: 'xm-password-reset-init',
    templateUrl: './password-reset-init.component.html',
})
export class PasswordResetInitComponent implements OnInit, AfterViewInit {
    error: string;
    errorEmailNotExists: string;
    resetAccount: any;
    success: string;

    @ViewChild('emailInputElement', {static: false}) emailInputElement: MatInput;

    private changeLanguageSubscriber: Subscription;

    constructor(private passwordResetInit: PasswordResetInit,
                private jhiLanguageService: JhiLanguageService,
                private modulesLangHelper: ModulesLanguageHelper,
                private eventManager: JhiEventManager) {
    }

    ngOnInit() {
        this.jhiLanguageService.changeLanguage(this.modulesLangHelper.getLangKey());
        this.resetAccount = {};

        this.changeLanguageSubscriber = this.eventManager.subscribe(XM_EVENT_LIST.XM_CHANGE_LANGUAGE, (event) => {
            this.jhiLanguageService.changeLanguage(event.content);
        });
    }

    ngAfterViewInit() {
        setTimeout(() => this.emailInputElement.focus(), 0);
    }

    requestReset() {
        this.error = null;
        this.errorEmailNotExists = null;

        this.passwordResetInit.save(this.resetAccount.email).subscribe(() => {
            this.success = 'OK';
        }, (response) => {
            this.success = null;
            if (response.status === 400 && response.data === 'email address not registered') {
                this.errorEmailNotExists = 'ERROR';
            } else {
                this.error = 'ERROR';
            }
        });
    }

    ngOnDestroy() {
        this.changeLanguageSubscriber.unsubscribe();
    }
}
