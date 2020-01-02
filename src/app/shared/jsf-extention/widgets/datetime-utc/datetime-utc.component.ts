import { Component, Input, OnInit } from '@angular/core';
import { JsonSchemaFormService } from 'angular2-json-schema-form';
import { DatetimeUtcOptionsModel } from './datetime-utc-options.model';

declare let moment: any;

@Component({
    selector: 'xm-ext-datetime-utc-widget',
    templateUrl: 'datetime-utc.component.html',
})
export class DatetimeUtcComponent implements OnInit {

    @Input() public layoutNode: any;

    public controlName: string;
    public controlValue: any;
    public controlValueFormatted: any;
    public options: DatetimeUtcOptionsModel;

    constructor(private jsf: JsonSchemaFormService) {
    }

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (this.controlValue) {
            this.controlValueFormatted = moment(this.controlValue).local().format('YYYY-MM-DD[T]HH:mm:ss');
        }
    }

    public changeText(event: any): void {
        this.jsf.updateValue(this, moment(event.target.value).utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]'));
    }
}
