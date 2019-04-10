import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JsonSchemaFormService } from 'angular2-json-schema-form';
import * as _ from 'lodash';

interface ISelectSettings {
    title?: string
    placeholder?: string,
    url?: string,
    minQueryLength: number,
    debounceTime: number,
    labelField: string,
    valueField: string,
    arrayField: string,
    readonly: boolean
}

interface ISelectOption {
    label: any;
    value: any;
}

@Component({
    selector: 'xm-ext-query-select-widget',
    templateUrl: 'ext-query-select.component.html',
    styleUrls: ['ext-query-select.component.scss']
})

export class ExtQuerySelectComponent implements OnInit {
    public settings: ISelectSettings;
    public options$: Observable<ISelectOption[]>;
    public checkedOption: FormControl = new FormControl();
    public queryCtrl: FormControl = new FormControl();
    public loading$ = new BehaviorSubject<boolean>(false);
    public maxDisplayedOptions = 50;

    @Input() layoutNode: any;

    constructor(
        private jsf: JsonSchemaFormService,
        private http: HttpClient
    ) {
    }

    ngOnInit(): void {
        this.settings = Object.assign({
            minQueryLength: 3,
            debounceTime: 300,
            labelField: 'name',
            valueField: 'id',
            url: '',
            readonly: false
        }, this.layoutNode.options || {});
        this.jsf.initializeControl(this);

        this.options$ = this.queryCtrl.valueChanges
            .pipe(
                filter(val => val.length > Number(this.settings.minQueryLength)),
                tap(() => this.checkedOption.reset('')),
                tap(() => this.loading$.next(true)),
                debounceTime(this.settings.debounceTime),
                switchMap(query => this.fetchOptions(query)),
                tap(() => this.loading$.next(false)),
            );

        this.checkedOption.valueChanges
            .pipe(
                tap(val => this.jsf.updateValue(this, val))
            )
            .subscribe(() => {})
    }

    fetchOptions(query: string): Observable<ISelectOption[]> {
        return this.http.get(this.settings.url, {
            params: {
                searchQuery: query
            }
        }).pipe(
            map(response => _.get(response, this.settings.arrayField, [])),
            map(options => options.map(option => {
                return {
                    label: _.get(option, this.settings.labelField, null),
                    value: _.get(option, this.settings.valueField, null)
                }
            })),
            map(options => options.filter(option => option.label !== null && option.value !== null)),
            map(options => options.length ? options : [])
        )
    }
}
