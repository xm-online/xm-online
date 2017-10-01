import { Component, OnInit, AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';

import { PasswordResetFinish } from './password-reset-finish.service';

@Component({
    selector: 'xm-password-reset-finish',
    templateUrl: './password-reset-finish.component.html'
})
export class PasswordResetFinishComponent implements OnInit, AfterViewInit {
    confirmPassword: string;
    doNotMatch: string;
    error: string;
    keyMissing: boolean;
    resetAccount: any;
    success: string;
    modalRef: NgbModalRef;
    key: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private passwordResetFinish: PasswordResetFinish,
        private route: ActivatedRoute,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private router: Router
    ) {
        this.jhiLanguageService.addLocation('reset');
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.key = params['key'];
        });
        this.resetAccount = {};
        this.keyMissing = !this.key;
    }

    ngAfterViewInit() {
        let htmlEl = this.elementRef.nativeElement.querySelector('#password');
        htmlEl && this.renderer.invokeElementMethod(htmlEl, 'focus', []);
    }

    finishReset() {
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

    login() {
        this.router.navigate([''])
    }
}
