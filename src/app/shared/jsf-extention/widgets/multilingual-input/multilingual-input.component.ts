import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { buildFormGroup, JsonSchemaFormService, removeRecursiveReferences } from 'angular2-json-schema-form';

import { JhiLanguageHelper } from '../../../index';
import { XmConfigService } from '../../../spec/config.service';
import { MultilingualInputOptions } from './multilingual-input-options.model';

@Component({
    selector: 'xm-multilingual-input-widget',
    templateUrl: 'multilingual-input.component.html'
})
export class MultilingualInputComponent implements OnInit {

    @Input() layoutNode: any;
    options: MultilingualInputOptions;

    currentLanguage: any;
    languages: any[];
    controlValue: any;
    text: string;

    constructor(private jsf: JsonSchemaFormService,
                private changeDetectorRef: ChangeDetectorRef,
                private languageHelper: JhiLanguageHelper,
                private xmConfigService: XmConfigService) {
    }

    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        this.controlValue = this.controlValue.filter(v => v.languageKey);

        this.languageHelper.getAll().then((languages) => {
            this.xmConfigService.getUiConfig().subscribe((config) => {
                this.languages = (config && config.langs) ? config.langs : languages;
                this.currentLanguage = this.languages[0];
                this.onChangeLanguage(this.currentLanguage);
                this.changeDetectorRef.detectChanges();
            });
        });
    }

    onChangeLanguage(lang) {
        this.currentLanguage = lang;
        const currentLanguageItem = this.controlValue.filter(v => v.languageKey === this.currentLanguage).shift();
        this.text = currentLanguageItem ? currentLanguageItem.name : '';
    }

    onChangeText() {
        const currentLanguageItem = this.controlValue.filter(v => v.languageKey === this.currentLanguage).shift();
        if (currentLanguageItem) {
            currentLanguageItem.name = this.text;
        } else {
            this.controlValue.push({
                languageKey: this.currentLanguage,
                name: this.text
            });
        }
        this.updateFormArrayComponent(this.controlValue);
    }

    // TODO: move it into the util class
    private updateFormArrayComponent(item: any) {
        const formArray: any = this.jsf.getFormControl(this);
        while (formArray.value.length) {
            formArray.removeAt(0);
        }
        const refPointer = removeRecursiveReferences(this.layoutNode.dataPointer + '/-', this.jsf.dataRecursiveRefMap, this.jsf.arrayMap);
        for (const i of item) {
            const newFormControl = buildFormGroup(this.jsf.templateRefLibrary[refPointer]);
            newFormControl.setValue(i);
            formArray.push(newFormControl);
        }
        formArray.markAsDirty();
    }

}
