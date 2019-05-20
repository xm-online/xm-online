import { Component, Input, OnInit } from '@angular/core';
import { JsonSchemaFormService } from 'angular2-json-schema-form';
import { FormGroup } from '@angular/forms';
import * as formatString from 'string-template';
import { startWith } from 'rxjs/operators';

import { I18nNamePipe } from '../../../language/i18n-name.pipe';
import { Principal } from '../../../auth/principal.service';

@Component({
    selector: 'xm-text-section',
    templateUrl: './text-section.component.html',
    styleUrls: ['./text-section.component.scss']
})
export class TextSectionComponent implements OnInit {

    options: any;
    calculatedContent: string;
    @Input() layoutNode: any;

    constructor(private jsf: JsonSchemaFormService,
                private i18nNamePipe: I18nNamePipe,
                public principal: Principal) {}

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
        const text =
                this.options['dynamicContent']['value'] ?
                this.i18nNamePipe.transform(this.options['dynamicContent']['value'], this.principal) : '';
        if (this.options['dynamicContent']['trackKeys']) {
            const keys = this.options['dynamicContent']['trackKeys']['keys'] || [];
            const opposite = !!this.options['dynamicContent']['trackKeys']['hasValues'];
            if (opposite) {
                const hasValues = [];
                keys.forEach(key => {if (data[key] && data[key] != null && data[key] !== 'undefined') {hasValues.push(data[key])}});
                this.calculatedContent = hasValues.length === keys.length ? formatString(text, data) : null;
            } else {
                const noValues = [];
                keys.forEach(key => {if (!data[key] || data[key] == null || data[key] === 'undefined') {noValues.push(data[key])}});
                this.calculatedContent = noValues.length > 0 ? formatString(text, data) : null;
            }
        } else {
            this.calculatedContent = formatString(text, data);
        }
    }
}
