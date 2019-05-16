import { Component, Input, OnInit } from '@angular/core';
import { JsonSchemaFormService } from 'angular2-json-schema-form';
import { FormGroup } from '@angular/forms';
import * as formatString from 'string-template';
import { startWith } from 'rxjs/operators';

@Component({
    selector: 'xm-text-section',
    templateUrl: './text-section.component.html',
    styleUrls: ['./text-section.component.scss']
})
export class TextSectionComponent implements OnInit {

    options: any;
    calculatedContent: string;
    @Input() layoutNode: any;

    constructor(private jsf: JsonSchemaFormService) {}

    ngOnInit() {
        this.options = this.layoutNode.options || {};
        if (this.options['dynamicContent']) {this.registerFieldsChanges()}
    }

    private registerFieldsChanges(): void {
        const fg: FormGroup = this.jsf.formGroup;
        fg.valueChanges
            .pipe(startWith(''))
            .subscribe(data => {
                this.processTemplateString(data);
            });
        fg.updateValueAndValidity();
    }

    private processTemplateString(data): void {
        if (this.options['dynamicContent']['trackKeys']) {
            const keys = this.options['dynamicContent']['trackKeys'] || [];
            const values = [];
            keys.forEach(key => {
                if (data[key] && data[key] != null && data[key] !== 'undefined') {
                    values.push(data[key]);
                }
            });
            this.calculatedContent =
                    values.length === this.options['dynamicContent']['trackKeys'].length ?
                    formatString(this.options['dynamicContent']['value'], data) :
                    null;
        } else {
            this.calculatedContent = formatString(this.options['dynamicContent']['value'], data);
        }
    }
}
