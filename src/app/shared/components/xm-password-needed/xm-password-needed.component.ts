import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

@Component({
    selector: 'xm-password-needed',
    templateUrl: './xm-password-needed.component.html'
})
export class XmPasswordNeededComponent implements OnInit {

    @ViewChild('passwordNeeded', {static: false}) tpl: ElementRef;
    form: FormGroup;
    modal: NgbModalRef;
    showLoader: boolean;
    incorrect: boolean;
    event: any;

    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                private eventManager: JhiEventManager) {
        this.form = fb.group({password: [null, Validators.required]});
    }

    get password(): AbstractControl {
        return this.form.get('password');
    }

    ngOnInit() {
        this.eventManager.subscribe('error.passwordNeeded', event => {
            this.event = event;
            this.incorrect = false;
            this.showLoader = false;
            this.password.reset(null);
            this.password.markAsUntouched();
            this.modal = this.modalService.open(this.tpl, {
                beforeDismiss: () => false
            });
        });
    }

    onSubmit() {
        if (this.form.valid) {
            this.incorrect = false;
            this.showLoader = true;
            const subscription = this.event.subject
                .catch(() => this.incorrect = true)
                .finally(() => {
                    this.showLoader = false;
                    subscription.unsubscribe();
                }).subscribe(() => {
                    this.modal.close()
                });
            this.event.subject.next(this.password.value);
        } else {
            this.password.updateValueAndValidity();
        }
    }

    onDismiss() {
        this.modal.close();
        this.event.subject.error();
    }

}
