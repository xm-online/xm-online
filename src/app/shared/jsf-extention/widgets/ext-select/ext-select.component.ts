import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { JsonSchemaFormService } from 'angular2-json-schema-form';
import { MatSelect, VERSION } from '@angular/material';
import { ReplaySubject ,  Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { Principal } from '../../../auth/principal.service';
import { I18nNamePipe } from '../../../language/i18n-name.pipe';
import { ExtSelectOptions } from './ext-select-options.model';
import { ExtSelectService } from './ext-select-service';

interface Element {
    label: any;
    value: any;
}

@Component({
    selector: 'xm-ext-select-widget',
    templateUrl: 'ext-select.component.html'
})
export class ExtSelectComponent implements OnInit, OnDestroy, AfterViewInit {
    version = VERSION;
    @Input() layoutNode: any;

    options: ExtSelectOptions;
    elements: any;
    controlValue: any;
    controlLabel: any;
    public elementCtrl: FormControl = new FormControl();
    public elementFilterCtrl: FormControl = new FormControl();
    public filteredElements: ReplaySubject<Element[]> = new ReplaySubject<Element[]>(1);
    @ViewChild('singleSelect') singleSelect: MatSelect;
    private _onDestroy = new Subject<void>();

    constructor(private jsf: JsonSchemaFormService,
                private http: HttpClient,
                private selectService: ExtSelectService,
                private i18nNamePipe: I18nNamePipe,
                private changeDetectorRef: ChangeDetectorRef,
                public principal: Principal) {
    }

    ngOnInit() {
        this.options = this.layoutNode.options || {};
        const options: any = this.options;
        this.jsf.initializeControl(this);
        if (this.layoutNode.dataType === 'array') {
            this.controlValue = this.controlValue[0];
        }
        this.elements = [];
        this.fetchData(options);
    }

    ngAfterViewInit() {
        // this.setInitialValue();
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    public initOptionList() {
        this.filteredElements.next(this.elements.slice());
        this.elementCtrl = this.elements.filter(e => e.value === this.controlValue)[0];
        this.elementFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterElements();
            });
    }

    private setInitialValue() {
        this.filteredElements
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
                this.singleSelect.compareWith = (a: Element, b: Element) => a.value === b.value;
            });
    }

    private filterElements() {
        if (!this.elements) {
            return;
        }
        let search = this.elementFilterCtrl.value;
        if (!search && search == null) {
            this.filteredElements.next(this.elements.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filteredElements.next(
            this.elements.filter(e => e.label.toLowerCase().indexOf(search) > -1)
        );
    }

    getLabel(controlValue) {
        if (controlValue instanceof Array && controlValue.length > 0) {
            controlValue = controlValue[0];
        }
        const value = this.elements.filter(it => it.value === controlValue);
        if (value.length > 0) {
            return value[0].label;
        }
        return '';
    }

    private fetchData(options: any) {
        if (options.sourceField) {
            const array = new Function('model', 'options', 'return ' + options.sourceField)(this.jsf.getData(), this.jsf.formOptions);
            this.elements = this.selectService.mapArrayToView(array, options);
            if (array !== false) {
                this.initOptionList();
                return;
            }
        }

        if (options.enum) {
            options.enum.forEach(it => {
                if (this.options.translations && this.options.translations[it]) {
                    this.elements.push({label: this.i18nNamePipe.transform(it, this.principal), value: it});
                } else {
                    this.elements.push({label: it, value: it});
                }
                this.initOptionList();
            });
        } else {
            this.selectService.fetchData(this.options).subscribe(elements => {
                this.elements = elements;
                this.initOptionList();
                this.changeDetectorRef.detectChanges();
            }, error => {
                console.error(error);
            });
        }
    }

    updateValue(event) {
        const item = this.elements.filter(e => e.value === event.value.value)[0];
        const fg: FormGroup = this.jsf.formGroup;
        if (this.options.relatedFields) {
            this.options.relatedFields.forEach(field => {
                fg.get(field.key).setValue(ExtSelectService.byString(item.object, field.value));
            })
        }
        if (this.layoutNode.dataType === 'array') {
            this.jsf.updateValue(this, [item.value]);
        } else {
            this.jsf.updateValue(this, item.value);
        }
        this.controlValue = event.value.value;
        this.controlLabel = event.value.label;
    }
}
