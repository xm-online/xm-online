import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JsonSchemaFormService } from 'angular2-json-schema-form';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { Principal } from '../../../auth/principal.service';
import { I18nNamePipe } from '../../../language/i18n-name.pipe';
import { ExtAutocompleteOptions } from './ext-autocomplete-options.model';
import { ExtAutocompleteService } from './ext-autocomplete-service';

import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";

declare const $: any;

@Component({
    selector: 'xm-ext-autocomplete-widget',
    templateUrl: 'ext-autocomplete.component.html',
    styleUrls: ['./ext-autocomplete.component.scss']
})
export class ExtAutocompleteComponent implements OnInit {

    @Input() layoutNode: any;

    options: ExtAutocompleteOptions;
    controlName: string;
    elements: any;
    filteredItems: any;
    showAutocomplete: boolean;
    searchLabel: string;
    dataFields: any;
    selectedItem: any;

    @ViewChild('emailRef', {static: false}) emailRef: ElementRef;

    constructor(private jsf: JsonSchemaFormService,
                private http: HttpClient,
                private principal: Principal,
                private autocompleteService: ExtAutocompleteService,
                private i18nNamePipe: I18nNamePipe,
                private changeDetectorRef: ChangeDetectorRef) {
        this.showAutocomplete = false;
        this.searchLabel = '';
    }

    ngOnInit() {
        fromEvent(this.emailRef.nativeElement, 'keyup').pipe(map((evt: any) => evt.target.value),
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe((text: string) => {
            this.trySearch(text);
        });

        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        this.elements = [];
        this.fetchData(this.options);
    }

    private fetchData(options: any) {
        if (options.enum) {
            options.enum.forEach(it => {
                if (this.options.translations && this.options.translations[it]) {
                    this.elements.push({label: this.i18nNamePipe.transform(it, this.principal), value: it});
                } else {
                    this.elements.push({label: it, value: it});
                }
            });
            this.assignCopy();
        } else {
            this.autocompleteService.fetchData(this.options).subscribe(elements => {
                this.elements = elements;
                this.assignCopy();
                this.changeDetectorRef.detectChanges();
            }, error => {
                console.error(error);
            });
        }
    }

    getLabel(controlValue) {
        const value = this.elements.filter(it => it.value === controlValue);
        if (value.length > 0) {
            return value[0].label;
        }
        return '';
    }

    hideAutocomplete() {
        const self = this;
        setTimeout(() => {
           self.showAutocomplete = false;
           this.changeDetectorRef.detectChanges();
        }, 100);
    }

    updateValue(item, event) {
        event.preventDefault();
        this.searchLabel = item.label;
        this.selectedItem = item;
        this.updateValueField(this.selectedItem);
        this.showDataFields(this.options, this.selectedItem.object);
        this.showAutocomplete = false;
    }

    updateValueField(el) {
        const item = el;
        const fg: FormGroup = this.jsf.formGroup;
        if (this.options.relatedFields) {
            this.options.relatedFields.forEach(field => {
                fg.get(field.key).setValue(ExtAutocompleteService.byString(item.object, field.value));
            })
        }
        if (this.layoutNode.dataType === 'array') {
            this.jsf.updateValue(this, [item.value]);
        } else {
            this.jsf.updateValue(this, item.value);
        }
    }

    private trySearch(text) {
        this.selectedItem = null;
        if (text.length < 3) {return false}
        this.filteredItems = [];
        if (!text) {this.assignCopy()}
        this.filteredItems = Object.assign([], this.elements).filter(
            (item) => item.label.toLowerCase().indexOf(text.toLowerCase()) > -1
        );
        this.showAutocomplete = true;
        this.changeDetectorRef.detectChanges();
    }

    assignCopy() {
        this.filteredItems = Object.assign([], this.elements);
    }

    showDataFields(options, item) {
        this.dataFields = [];
        const data = item.data ? item.data : null;
        if (options.showDataFields && data) {
            const fields = options.showDataFields || [];
            fields.forEach((e) => {
                const userField = e.value;
                if (data && data.hasOwnProperty(userField)) {
                    this.dataFields.push({title: e.title, message: data[userField] ? data[userField] : null});
                }
            });
        }
    }
}
