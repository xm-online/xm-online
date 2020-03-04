import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { XmEventManager } from '@xm-ngx/core';
import { JsonSchemaFormService } from 'angular2-json-schema-form';
import { fromEvent as observableFromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'xm-validation-widget',
    templateUrl: 'validation-component.component.html',
})
export class ValidationComponent implements OnInit, OnDestroy {

    @Input() public layoutNode: any;

    public click: Subscription;

    public options: any;

    constructor(private jsf: JsonSchemaFormService,
                private eventManager: XmEventManager) {
    }

    // tslint:disable-next-line:cognitive-complexity
    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        const formGroup: FormGroup = this.jsf.formGroup;

        this.click = observableFromEvent(document, 'click').pipe(
            debounceTime(10))
            .subscribe(() => {
                this.traverseControls(formGroup, (control: AbstractControl) => {
                    if (control.enabled && !control.untouched && !control.dirty) {
                        control.markAsDirty();
                        control.setValue(control.value);
                    }
                    control.updateValueAndValidity({emitEvent: true});
                });
                formGroup.updateValueAndValidity({emitEvent: true});
            });

        this.eventManager.subscribe('xm.ValidationError', (it) => {
            const path = it.content.validationField;
            if (path) {
                const control = this.resolveComponentByPath(formGroup, path.split('[')
                    .join('.').split(']').join('.').split('.'));
                if (control) {
                    control.setErrors({BE_ERROR: it.title});
                }
            }
            if (it.errors) {
                // tslint:disable-next-line:forin
                for (const key in it.errors) {
                    const control = this.resolveComponentByPath(formGroup, key.split('[')
                        .join('.').split(']').join('.').split('.'));
                    if (control) {
                        control.setErrors({BE_ERROR: it.errors[key]});
                    }
                }
            }

            formGroup.updateValueAndValidity();
        });

    }

    public traverseControls(form: FormGroup | FormArray, operation: any): void {
        Object.keys(form.controls).forEach((key: string) => {
            const abstractControl = form.controls[key];

            if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
                this.traverseControls(abstractControl, operation);
            } else {
                operation(abstractControl);
            }
        });
    }

    public resolveComponentByPath(group: FormGroup | FormArray, path: any): AbstractControl {
        const abstractControl = group.controls[path.shift()];
        if (path.length === 0) {
            return abstractControl;
        }
        if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
            return this.resolveComponentByPath(abstractControl, path);
        }
        return null;
    }

    public ngOnDestroy(): void {
        this.click.unsubscribe();
    }

}
