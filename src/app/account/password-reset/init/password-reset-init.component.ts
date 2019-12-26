import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material';
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

    @ViewChild('emailInputElement', {static: false}) public emailInputElement: MatInput;

    constructor(private passwordResetInit: PasswordResetInit) {
    }

    public ngOnInit(): void {
        this.resetAccount = {};
    }

    public ngAfterViewInit(): void {
        setTimeout(() => this.emailInputElement.focus(), 0);
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
