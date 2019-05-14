import { Component, Input, OnInit } from '@angular/core';
import { JsonSchemaFormService } from 'angular2-json-schema-form';
import { FormControl } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';

import { Principal } from '../../../auth/principal.service';
import { UUID } from 'angular2-uuid';

@Component({
    selector: 'xm-ajsf-email-matcher',
    templateUrl: './email-matcher.component.html',
    styleUrls: ['./email-matcher.component.scss']
})
export class EmailMatcherComponent implements OnInit {

    controlName: string;
    controlValue: any;
    controlNameOriginal: any;
    controlNameMatcher: any;
    originalControl = new FormControl();
    matcherControl = new FormControl();
    options: any;
    @Input() layoutNode: any;

    constructor(private jsf: JsonSchemaFormService, public principal: Principal) {
        this.controlNameOriginal = UUID.UUID();
        this.controlNameMatcher = UUID.UUID();
    }

    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (this.controlValue) {
            this.originalControl.setValue(this.controlValue);
            this.matcherControl.setValue(this.controlValue);
        }
        if (this.options['readonly']) {
            this.matcherControl.disable({onlySelf: true});
            this.originalControl.disable({onlySelf: true});
        }
        this.registerOriginalChanger();
        this.registerMatcherChanger();
    }

    registerOriginalChanger() {
        this.originalControl
            .valueChanges
            .pipe(
                debounceTime(200),
                tap((res) => {
                        this.matcherControl.markAsUntouched();
                        this.originalControl.markAsDirty();
                        this.originalControl.markAsTouched();
                        if (this.originalControl.value !== this.matcherControl.value) {
                            if (this.matcherControl.value && this.matcherControl.value.length > 0) {
                                this.matcherSetError();
                            }
                            this.controlValue = '';
                            this.updateValue(this.controlValue);
                        } else {
                            this.matcherControl.setErrors(null);
                            this.controlValue = this.originalControl.value;
                            this.updateValue(this.controlValue);
                        }
                    }
                )
            )
            .subscribe(value => {});
    }

    registerMatcherChanger() {
        this.matcherControl
            .valueChanges
            .pipe(
                debounceTime(200),
                tap((res) => {
                        if (this.originalControl.value !== this.matcherControl.value) {
                            this.matcherSetError();
                            this.controlValue = '';
                            this.updateValue(this.controlValue);
                        } else {
                            this.matcherControl.setErrors(null);
                            this.controlValue = this.originalControl.value;
                            this.updateValue(this.controlValue);
                        }
                    }
                )
            )
            .subscribe(value => {});
    }

    private updateValue(value): void {
        this.jsf.updateValue(this, value);
    }

    private matcherSetError(): void {
        this.matcherControl.markAsDirty();
        this.matcherControl.markAsTouched();
        this.matcherControl.setErrors({'not-match': true});
    }
}
