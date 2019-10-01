import { Component, Input, OnInit } from '@angular/core';
import { JsonSchemaFormService } from 'angular2-json-schema-form';

import { ExtTextareaOptions } from './ext-textarea-options.model';

@Component({
    selector: 'xm-ext-textarea-widget',
    templateUrl: 'ext-textarea.component.html',
})
export class ExtTextareaComponent implements OnInit {

    @Input() layoutNode: any;

    controlValue: any;
    options: ExtTextareaOptions;

    constructor(private jsf: JsonSchemaFormService) {
    }

    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }

    changeText(event) {
        this.jsf.updateValue(this, event.target.value);
    }

}
