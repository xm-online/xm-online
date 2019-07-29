import { AfterViewInit, Component, ElementRef, OnInit, Renderer } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';

import { PasswordResetInit } from './password-reset-init.service';

@Component({
    selector: 'xm-password-reset-init',
    templateUrl: './password-reset-init.component.html',
})
export class PasswordResetInitComponent implements OnInit, AfterViewInit {
    public error: string;
    public errorEmailNotExists: string;
    public resetAccount: any;
    public success: string;

    constructor(
        private passwordResetInit: PasswordResetInit,
        private elementRef: ElementRef,
        private renderer: Renderer,
    ) {
    }

    public ngOnInit(): void {
        this.resetAccount = {};
    }

    public ngAfterViewInit(): void {
        const htmlEl = this.elementRef.nativeElement.querySelector('#email');
        htmlEl && this.renderer.invokeElementMethod(htmlEl, 'focus', []);
    }

    public requestReset(): void {
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
