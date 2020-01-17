import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { JsonSchemaFormService } from 'angular2-json-schema-form';

import { UUID } from 'angular2-uuid';
import { debounceTime, tap } from 'rxjs/operators';
import { Principal } from '../../../auth/principal.service';

@Component({
    selector: 'xm-ajsf-email-matcher',
    templateUrl: './email-matcher.component.html',
    styleUrls: ['./email-matcher.component.scss'],
})
export class EmailMatcherComponent implements OnInit {

    public controlName: string;
    public controlValue: any;
    public controlNameOriginal: any;
    public controlNameMatcher: any;
    public originalControl: FormControl = new FormControl();
    public matcherControl: FormControl = new FormControl();
    public options: any;
    @Input() public layoutNode: any;

    constructor(private jsf: JsonSchemaFormService, public principal: Principal) {
        this.controlNameOriginal = UUID.UUID();
        this.controlNameMatcher = UUID.UUID();
    }

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (this.controlValue) {
            this.originalControl.setValue(this.controlValue);
            this.matcherControl.setValue(this.controlValue);
        }
        if (this.options.readonly) {
            this.matcherControl.disable({onlySelf: true});
            this.originalControl.disable({onlySelf: true});
        }
        this.registerOriginalChanger();
        this.registerMatcherChanger();
    }

    public registerOriginalChanger(): void {
        this.originalControl
            .valueChanges
            .pipe(
                debounceTime(200),
                tap(() => {
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
                    },
                ),
            )
            .subscribe();
    }

    public registerMatcherChanger(): void {
        this.matcherControl
            .valueChanges
            .pipe(
                debounceTime(200),
                tap(() => {
                        if (this.originalControl.value !== this.matcherControl.value) {
                            this.matcherSetError();
                            this.controlValue = '';
                            this.updateValue(this.controlValue);
                        } else {
                            this.matcherControl.setErrors(null);
                            this.controlValue = this.originalControl.value;
                            this.updateValue(this.controlValue);
                        }
                    },
                ),
            )
            .subscribe();
    }

    private updateValue(value: any): void {
        this.jsf.updateValue(this, value);
    }

    private matcherSetError(): void {
        this.matcherControl.markAsDirty();
        this.matcherControl.markAsTouched();
        this.matcherControl.setErrors({'not-match': true});
    }
}
