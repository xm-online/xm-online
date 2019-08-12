import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {JsonSchemaFormService} from 'angular2-json-schema-form';
import {TdTextEditorComponent} from '@covalent/text-editor';

@Component({
    selector: 'xm-ext-md-editor-widget',
    templateUrl: 'ext-md-editor.component.html',
    styleUrls: ['ext-md-editor.component.scss']
})

export class ExtMdEditorComponent implements OnInit {
    @ViewChild('mdEditor', {static: false}) private _textEditor: TdTextEditorComponent;
    @Input() layoutNode: any;

    controlValue: any;
    options: any;
    isEditable = false;
    editorOptions: any = {
        autofocus: true,
        status: false,
        promptURLs: true,
        spellChecker: false,
        showIcons: ['code', 'table']
    };

    constructor(private jsf: JsonSchemaFormService) {
    }

    onToggleEditor() {
        this.isEditable = !this.isEditable;
    }

    onSaveMd() {
        this.jsf.updateValue(this, this._textEditor.value);
        this.onToggleEditor()
    }

    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }

    get componentText(): string {
        return this.controlValue ? this.controlValue : '';
    }
}
