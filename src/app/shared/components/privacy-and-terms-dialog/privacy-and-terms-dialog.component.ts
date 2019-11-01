import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService } from 'ng-jhipster';
import { AuthServerProvider } from '../../auth/auth-jwt.service';

@Component({
    selector: 'xm-privacy-and-terms-dialog',
    templateUrl: './privacy-and-terms-dialog.component.html',
    styleUrls: ['./privacy-and-terms-dialog.component.scss'],
})
export class PrivacyAndTermsDialogComponent implements OnInit {

    @Input() config: any;
    iAgree = false;
    lang: string;
    termsToken: string;

    constructor(private activeModal: NgbActiveModal,
                private authServerProvider: AuthServerProvider,
                private languageService: JhiLanguageService) {
        this.languageService.getCurrent().then((lang) => {
            this.lang = lang;
        });
    }

    ngOnInit() {
    }

    onCancel() {
        this.activeModal.close('cancel');
    }

    onAccept() {
        if (!this.termsToken) {
            this.activeModal.close('accept');
        } else {
            this.acceptTerms(this.termsToken);
        }

    }

    private acceptTerms(token: string): void {
        this.authServerProvider
            .acceptTermsAndConditions(token)
            .subscribe(() => this.activeModal.close('accept'), (err) => this.onCancel());
    }
}
