import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { XmEventManager } from '@xm-ngx/core';

@Component({
    selector: 'xm-password-needed',
    templateUrl: './xm-password-needed.component.html',
})
export class XmPasswordNeededComponent implements OnInit {

    @ViewChild('passwordNeeded', {static: false}) public tpl: TemplateRef<any>;
    public form: FormGroup;
    public modal: MatDialogRef<any>;
    public showLoader: boolean;
    public incorrect: boolean;
    public event: any;

    constructor(private fb: FormBuilder,
                private modalService: MatDialog,
                private eventManager: XmEventManager) {
        this.form = this.fb.group({password: [null, Validators.required]});
    }

    get password(): AbstractControl {
        return this.form.get('password');
    }

    public ngOnInit(): void {
        this.eventManager.subscribe('error.passwordNeeded', (event) => {
            this.event = event;
            this.incorrect = false;
            this.showLoader = false;
            this.password.reset(null);
            this.password.markAsUntouched();
            this.modal = this.modalService.open(this.tpl, {});
            this.modal.beforeClosed().subscribe(() => false);
        });
    }

    public onSubmit(): void {
        if (this.form.valid) {
            this.incorrect = false;
            this.showLoader = true;
            const subscription = this.event.subject
                .catch(() => this.incorrect = true)
                .finally(() => {
                    this.showLoader = false;
                    subscription.unsubscribe();
                }).subscribe(() => {
                    this.modal.close();
                });
            this.event.subject.next(this.password.value);
        } else {
            this.password.updateValueAndValidity();
        }
    }

    public onDismiss(): void {
        this.modal.close();
        this.event.subject.error();
    }

}
