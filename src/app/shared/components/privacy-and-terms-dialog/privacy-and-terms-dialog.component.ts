import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService } from 'ng-jhipster';

@Component({
    selector: 'xm-privacy-and-terms-dialog',
    templateUrl: './privacy-and-terms-dialog.component.html',
    styleUrls: ['./privacy-and-terms-dialog.component.scss']
})
export class PrivacyAndTermsDialogComponent implements OnInit {

    @Input() config: any;
    iAgree = false;
    lang: string;

    constructor(private activeModal: NgbActiveModal,
                private languageService: JhiLanguageService) {
        this.languageService.getCurrent().then(lang => {
            this.lang = lang;
        });
    }

    ngOnInit() {
    }

    onCancel() {
        this.activeModal.close('cancel');
    }

    onAccept() {
        this.activeModal.close('accept');
    }

}
