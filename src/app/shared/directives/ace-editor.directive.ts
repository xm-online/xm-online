import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

import 'brace';
import 'brace/mode/json';
import 'brace/mode/yaml';
import 'brace/theme/chrome';

declare var ace: any;

@Directive({
    selector: '[xmAceEditor]'
})
export class AceEditorDirective {

    _options: any = {};
    _highlightActiveLine = true;
    _showGutter = true;
    _readOnly = false;
    _theme = 'chrome';
    _mode = 'json';
    _autoUpdateContent = true;

    editor: any;
    oldText: any;

    @Output('textChanged') textChanged = new EventEmitter();

    constructor(elementRef: ElementRef) {
        const el = elementRef.nativeElement;
        ace.config.set('basePath', '/node_modules/brace');
        this.editor = ace['edit'](el);
        this.init();
        this.initEvents();
    }

    init() {
        this.editor.getSession().setUseWorker(false);
        this.editor.setOptions(this._options);
        this.editor.setTheme(`ace/theme/${this._theme}`);
        this.editor.getSession().setMode(`ace/mode/${this._mode}`);
        this.editor.setHighlightActiveLine(this._highlightActiveLine);
        this.editor.renderer.setShowGutter(this._showGutter);
        this.editor.setReadOnly(this._readOnly);
        this.editor.$blockScrolling = Infinity;
    }

    initEvents() {
        this.editor.on('change', (e) => {
            this.updateValue(e);
        });
        this.editor.on('keypress', (e) => {
            this.updateValue(e);
        });
        this.editor.on('paste', (e) => {
            this.updateValue(e);
        });
    }

    private updateValue(e): void {
        const newVal = this.editor.getValue();
        if (newVal === this.oldText) {
            return;
        }
        if (typeof this.oldText !== 'undefined') {
            this.textChanged.emit(newVal);
        }
        this.oldText = newVal;
    }

    @Input() set options(options: any) {
        this._options = options;
        this.editor.setOptions(options || {});
    }

    @Input() set readOnly(readOnly: any) {
        this._readOnly = readOnly;
        this.editor.setReadOnly(readOnly);
    }

    @Input() set theme(theme: any) {
        this._theme = theme;
        this.editor.setTheme(`ace/theme/${theme}`);
    }

    @Input() set mode(mode: any) {
        this._mode = mode;
        this.editor.getSession().setMode(`ace/mode/${mode}`);
    }

    @Input() set text(text: any) {
        if (!text) {
            text = '';
        }

        if (this._autoUpdateContent === true) {
            this.editor.setValue(text);
            this.editor.clearSelection();
            this.editor.focus();
            this.editor.moveCursorTo(0, 0);
        }
    }

    @Input() set autoUpdateContent(status: any) {
        this._autoUpdateContent = status;
    }

    @Input() set gotoLine(line: number) {
        if (line) {
            this.editor.resize(true);
            this.editor.scrollToLine(line, true, true, function () {
            });
            this.editor.gotoLine(line, 0, true);
        }
    }

}
