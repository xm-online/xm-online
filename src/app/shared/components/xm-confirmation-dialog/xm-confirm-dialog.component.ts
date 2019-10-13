import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'xm-confirm-dialog',
    templateUrl: './xm-confirm-dialog.component.html'
})
export class XmConfirmDialogComponent implements OnInit {

    @ViewChild('xmConfirmDialog', {static: false}) tpl: ElementRef;
    form: FormGroup;
    modal: NgbModalRef;
    showLoader: boolean;
    incorrect: boolean;
    event: any;

    constructor(
        private fb: FormBuilder,
    ) {
        this.form = this.fb.group({ password: [null, Validators.required] });
    }

    ngOnInit() {

    }

    onSubmit() {

    }

    onDismiss() {
        this.modal.close();
    }

}
