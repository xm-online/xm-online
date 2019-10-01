
import {fromEvent as observableFromEvent,  Subscription } from 'rxjs';

import {debounceTime} from 'rxjs/operators';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { JsonSchemaFormService } from 'angular2-json-schema-form';
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';


import { JhiEventManager } from 'ng-jhipster';

@Component({
    selector: 'xm-validation-widget',
    templateUrl: 'validation-component.component.html'
})
export class ValidationComponent implements OnInit, OnDestroy {

    @Input() layoutNode: any;

    click: Subscription;

    options: any;

    constructor(private jsf: JsonSchemaFormService,
                private eventManager: JhiEventManager) {
    }

    ngOnInit() {
        this.options = this.layoutNode.options || {};
        // console.log(this.jsf);
        this.jsf.initializeControl(this);
        const formGroup: FormGroup = this.jsf.formGroup;

        this.click = observableFromEvent(document, 'click').pipe(
            debounceTime(10))
            .subscribe(e => {
                // let wasUpdated = false;
                this.traverseControls(formGroup, (control: AbstractControl) => {
                    if (control.enabled && !control.untouched && !control.dirty) {
                        control.markAsDirty();
                        control.setValue(control.value);
                        // wasUpdated = true;
                    }
                    control.updateValueAndValidity({emitEvent: true});
                });
                formGroup.updateValueAndValidity({emitEvent: true});
            });

        this.eventManager.subscribe('xm.ValidationError', it => {
            console.log(it);
            const path = it.content.validationField;
            if (path) {
                let control = this.resolveComponentByPath(formGroup, path.split('[').join('.').split(']').join('.').split('.'));
                if (control) {
                    control.setErrors({'BE_ERROR': it.title});
                }
            }
            if (it.errors) {
                for (let key in it.errors) {
                    let control = this.resolveComponentByPath(formGroup, key.split('[').join('.').split(']').join('.').split('.'));
                    if (control) {
                        control.setErrors({'BE_ERROR': it.errors[key]});
                    }
                }
            }

            formGroup.updateValueAndValidity();
        });

    }

    traverseControls(form: FormGroup | FormArray, operation): void {
        Object.keys(form.controls).forEach((key: string) => {
            const abstractControl = form.controls[key];

            if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
                this.traverseControls(abstractControl, operation);
            } else {
                operation(abstractControl);
            }
        });
    }

    resolveComponentByPath(group: FormGroup | FormArray, path): AbstractControl {
        const abstractControl = group.controls[path.shift()];
        if (path.length === 0) {
            return abstractControl;
        }
        if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
            return this.resolveComponentByPath(abstractControl, path);
        }
        return null;
    }

    ngOnDestroy(): void {
        this.click.unsubscribe();
    }

}
