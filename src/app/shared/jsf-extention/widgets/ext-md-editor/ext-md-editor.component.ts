import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {TdTextEditorComponent} from '@covalent/text-editor';
import {JsonSchemaFormService} from 'angular2-json-schema-form';

@Component({
    selector: 'xm-ext-md-editor-widget',
    templateUrl: 'ext-md-editor.component.html',
    styleUrls: ['ext-md-editor.component.scss'],
})

export class ExtMdEditorComponent implements OnInit {
    @ViewChild('mdEditor', {static: false}) private _textEditor: TdTextEditorComponent;
    @Input() public layoutNode: any;

    public controlValue: any;
    public options: any;
    public isEditable = false;
    public editorOptions: any = {
        autofocus: true,
        status: false,
        promptURLs: true,
        spellChecker: false,
        showIcons: ['code', 'table'],
    };

    constructor(private jsf: JsonSchemaFormService) {
    }

    public onToggleEditor() {
        this.isEditable = !this.isEditable;
    }

    public onSaveMd() {
        this.jsf.updateValue(this, this._textEditor.value);
        this.onToggleEditor();
    }

    public ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }

    get componentText(): string {
        return this.controlValue ? this.controlValue : '';
    }
}
