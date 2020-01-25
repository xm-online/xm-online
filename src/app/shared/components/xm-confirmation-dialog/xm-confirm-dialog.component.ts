import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'xm-confirm-dialog',
    templateUrl: './xm-confirm-dialog.component.html',
})
export class XmConfirmDialogComponent {

    @ViewChild('xmConfirmDialog', {static: false}) public tpl: ElementRef;
    public form: FormGroup;
    public modal: NgbModalRef;
    public showLoader: boolean;
    public incorrect: boolean;
    public event: any;

    constructor(
        private fb: FormBuilder,
    ) {
        this.form = this.fb.group({password: [null, Validators.required]});
    }

    public onSubmit(): void {
        throw new Error('Not implemented');
    }

    public onDismiss(): void {
        this.modal.close();
    }

}
