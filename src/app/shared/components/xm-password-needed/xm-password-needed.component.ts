import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

@Component({
    selector: 'xm-password-needed',
    templateUrl: './xm-password-needed.component.html',
})
export class XmPasswordNeededComponent implements OnInit {

    @ViewChild('passwordNeeded', {static: false}) public tpl: ElementRef;
    public form: FormGroup;
    public modal: NgbModalRef;
    public showLoader: boolean;
    public incorrect: boolean;
    public event: any;

    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                private eventManager: JhiEventManager) {
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
            this.modal = this.modalService.open(this.tpl, {
                beforeDismiss: () => false,
            });
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
