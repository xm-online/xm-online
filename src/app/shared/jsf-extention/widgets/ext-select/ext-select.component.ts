import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    forwardRef,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Version,
    ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { JsonSchemaFormComponent, JsonSchemaFormService } from 'angular2-json-schema-form';
import { MatSelect, VERSION } from '@angular/material';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { filter, map, takeUntil, tap, mergeMap, finalize } from 'rxjs/operators';

import { Principal } from '../../../auth/principal.service';
import { I18nNamePipe } from '../../../language/i18n-name.pipe';
import { ExtSelectOptions } from './ext-select-options.model';
import { ExtSelectService } from './ext-select-service';
import { environment } from '../../../../../environments/environment';

interface Element {
    label: any;
    value: any;
}

@Component({
    selector: 'xm-ext-select-widget',
    templateUrl: 'ext-select.component.html'
})
export class ExtSelectComponent implements OnInit, OnDestroy, AfterViewInit {
    version: Version = VERSION;
    @Input() layoutNode: any;

    options: ExtSelectOptions;
    elements: any = [];
    controlValue: any;
    controlLabel: any;
    disabled$ = new BehaviorSubject<boolean>(false);
    private regTemplateLiteral: RegExp = /@{\w+}/g;
    public cacheOptionsUrl: string | null;
    public elementCtrl: FormControl = new FormControl();
    public elementFilterCtrl: FormControl = new FormControl();
    public filteredElements: ReplaySubject<Element[]> = new ReplaySubject<Element[]>(1);
    public placeholder: BehaviorSubject<string>;

    @ViewChild('singleSelect', {static: false}) singleSelect: MatSelect;
    private _onDestroy = new Subject<void>();

    constructor(
        @Inject(forwardRef(() => JsonSchemaFormComponent)) private _parent: JsonSchemaFormComponent,
        private jsf: JsonSchemaFormService,
        private selectService: ExtSelectService,
        private i18nNamePipe: I18nNamePipe,
        private changeDetectorRef: ChangeDetectorRef,
        public principal: Principal
    ) {}

    ngOnInit() {
        this.options = this.layoutNode.options || {};
        if (!environment.production) {
            console.log('[dbg] initial -> %o', this.options)
        }
        this.jsf.initializeControl(this);
        if (this.layoutNode.dataType === 'array') {
            this.controlValue = this.controlValue[0];
        }

        this.placeholder = new BehaviorSubject<string>(this.options.title);
        this.filteredElements.subscribe(elements => {
            if (!elements.length) {
                this.placeholder.next(this.options.emptyPlaceholder || this.options.title);
            } else {
                this.placeholder.next(this.options.title);
            }
        });
    }

    ngAfterViewInit() {
        if (!this.options.url || !this.regTemplateLiteral.test(this.options.url)) {
            this.fetchData(this.options);
            return
        }

        const savedLiteralsValue = {};

        this.disabled$.next(true);
        this.options.url
            .match(this.regTemplateLiteral)
            .map(literal => {savedLiteralsValue[literal] = null; return literal})
            .map(result => result.replace(/@{|}/g, ''))
            .forEach(eLiteral => {
                let currentFieldName: string;

                of(eLiteral).pipe(
                    filter(fieldLiteral => !!fieldLiteral),
                    tap(fieldName => currentFieldName = fieldName),
                    mergeMap(fieldName => this._parent.jsf.formGroup.get(fieldName).valueChanges),
                    tap(() => this.disabled$.next(true)),
                    filter(fieldValue => !!fieldValue),
                    tap(fieldValue => savedLiteralsValue[`@{${currentFieldName}}`] = fieldValue),
                    map(() => savedLiteralsValue),
                    filter(literalsValue => Object.values(literalsValue).findIndex(val => !val) === -1),
                    tap(() => this.disabled$.next(false)),
                    map(literalsValue => {
                        let optionsUrl = this.options.url;
                        Object.keys(literalsValue)
                            .forEach(literal => optionsUrl = optionsUrl.replace(literal, literalsValue[literal]));
                        return optionsUrl;
                    }),
                    filter(optionsUrl => optionsUrl !== this.cacheOptionsUrl),
                    tap(optionsUrl => this.cacheOptionsUrl = optionsUrl),
                    map((optionsUrl: string) => {
                        const cloneOptions = Object.assign({}, this.options);
                        cloneOptions.url = optionsUrl;
                        return cloneOptions;
                    }),
                    tap(options => this.fetchData(options)),
                    tap(() => this.jsf.updateValue(this, this.controlValue)),
                    takeUntil(this._onDestroy)
                ).subscribe(() => {})
            });
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
                    this.elements.push({label: this.i18nNamePipe.transform(this.options.translations[it], this.principal), value: it});
                } else {
                    this.elements.push({label: it, value: it});
                }
                this.initOptionList();
            });
        } else {
            if (!this.options.url && !this.regTemplateLiteral.test(this.options.url)) {return}

            this.fetchOptions(options).pipe(
                tap(items => !environment.production && console.log('[dbg] ext-select -> ', items)),
                tap(items => this.elements = items),
                tap( () => this.initOptionList()),
                finalize(() => this.changeDetectorRef.detectChanges())
            ).subscribe(
                () => {if (this.controlValue) {this.jsf.updateValue(this, this.controlValue)}},
                error => console.error(error));
        }
    }

    private fetchOptions(options: any): Observable <any[]> {
        return this.selectService.fetchData(options);
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
