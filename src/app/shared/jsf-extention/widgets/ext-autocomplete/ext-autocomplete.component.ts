import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JsonSchemaFormService } from 'angular2-json-schema-form';
import { fromEvent } from 'rxjs';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { Principal } from '../../../auth/principal.service';
import { I18nNamePipe } from '../../../language/i18n-name.pipe';
import { ExtAutocompleteOptions } from './ext-autocomplete-options.model';
import { byString, ExtAutocompleteService } from './ext-autocomplete-service';

@Component({
    selector: 'xm-ext-autocomplete-widget',
    templateUrl: 'ext-autocomplete.component.html',
    styleUrls: ['./ext-autocomplete.component.scss'],
})
export class ExtAutocompleteComponent implements OnInit {

    @Input() public layoutNode: any;

    public options: ExtAutocompleteOptions;
    public controlName: string;
    public elements: any;
    public filteredItems: any;
    public showAutocomplete: boolean;
    public searchLabel: string;
    public dataFields: any;
    public selectedItem: any;

    @ViewChild('emailRef', {static: false}) public emailRef: ElementRef;

    constructor(private jsf: JsonSchemaFormService,
                private principal: Principal,
                private autocompleteService: ExtAutocompleteService,
                private i18nNamePipe: I18nNamePipe,
                private changeDetectorRef: ChangeDetectorRef) {
        this.showAutocomplete = false;
        this.searchLabel = '';
    }

    public ngOnInit(): void {
        fromEvent(this.emailRef.nativeElement, 'keyup').pipe(map((evt: any) => evt.target.value),
            debounceTime(500),
            distinctUntilChanged(),
        ).subscribe((text: string) => {
            this.trySearch(text);
        });

        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        this.elements = [];
        this.fetchData(this.options);
    }

    public getLabel(controlValue: any): string | any {
        const value = this.elements.filter((it) => it.value === controlValue);
        if (value.length > 0) {
            return value[0].label;
        }
        return '';
    }

    public hideAutocomplete(): void {
        const self = this;
        setTimeout(() => {
            self.showAutocomplete = false;
            this.changeDetectorRef.detectChanges();
        }, 100);
    }

    public updateValue(item: any, event: any): void {
        event.preventDefault();
        this.searchLabel = item.label;
        this.selectedItem = item;
        this.updateValueField(this.selectedItem);
        this.showDataFields(this.options, this.selectedItem.object);
        this.showAutocomplete = false;
    }

    public updateValueField(el: any): void {
        const item = el;
        const fg: FormGroup = this.jsf.formGroup;
        if (this.options.relatedFields) {
            this.options.relatedFields.forEach((field) => {
                fg.get(field.key).setValue(byString(item.object, field.value));
            });
        }
        if (this.layoutNode.dataType === 'array') {
            this.jsf.updateValue(this, [item.value]);
        } else {
            this.jsf.updateValue(this, item.value);
        }
    }

    public assignCopy(): void {
        this.filteredItems = Object.assign([], this.elements);
    }

    public showDataFields(options: any, item: any): void {
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

    private fetchData(options: any): void {
        if (options.enum) {
            options.enum.forEach((it) => {
                if (this.options.translations && this.options.translations[it]) {
                    this.elements.push({label: this.i18nNamePipe.transform(it, this.principal), value: it});
                } else {
                    this.elements.push({label: it, value: it});
                }
            });
            this.assignCopy();
        } else {
            this.autocompleteService.fetchData(this.options).subscribe((elements) => {
                this.elements = elements;
                this.assignCopy();
                this.changeDetectorRef.detectChanges();
            }, (error) => {
                console.warn(error);
            });
        }
    }

    private trySearch(text: string): void {
        this.selectedItem = null;
        if (text.length < 3) { return; }
        this.filteredItems = [];
        if (!text) {this.assignCopy(); }
        this.filteredItems = Object.assign([], this.elements).filter(
            (item) => item.label.toLowerCase().indexOf(text.toLowerCase()) > -1,
        );
        this.showAutocomplete = true;
        this.changeDetectorRef.detectChanges();
    }
}
