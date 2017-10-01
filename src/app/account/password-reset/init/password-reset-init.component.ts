import { Component, OnInit, AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';

import { PasswordResetInit } from './password-reset-init.service';

@Component({
    selector: 'xm-password-reset-init',
    templateUrl: './password-reset-init.component.html'
})
export class PasswordResetInitComponent implements OnInit, AfterViewInit {
    error: string;
    errorEmailNotExists: string;
    resetAccount: any;
    success: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private passwordResetInit: PasswordResetInit,
        private elementRef: ElementRef,
        private renderer: Renderer
    ) {
        this.jhiLanguageService.addLocation('reset');
    }

    ngOnInit() {
        this.resetAccount = {};
    }

    ngAfterViewInit() {
        let htmlEl = this.elementRef.nativeElement.querySelector('#email');
        htmlEl && this.renderer.invokeElementMethod(htmlEl, 'focus', []);
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
}
