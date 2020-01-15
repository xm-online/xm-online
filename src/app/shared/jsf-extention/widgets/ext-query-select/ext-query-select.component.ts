import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { JsonSchemaFormService } from 'angular2-json-schema-form';
import * as _ from 'lodash';
import { BehaviorSubject, iif, merge, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, debounceTime, filter, finalize, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

interface ISelectSettings {
    title?: string;
    placeholder?: string;
    url?: string;
    minQueryLength: number;
    debounceTime: number;
    labelField: string;
    valueField: string;
    arrayField: string;
    readonly: boolean;
}

interface ISelectOption {
    label: any;
    value: any;
}

@Component({
    selector: 'xm-ext-query-select-widget',
    templateUrl: 'ext-query-select.component.html',
    styleUrls: ['ext-query-select.component.scss'],
})

export class ExtQuerySelectComponent implements OnInit, OnDestroy {
    public settings: ISelectSettings;
    public options$: Observable<ISelectOption[]>;
    public checkedOption: FormControl = new FormControl();
    public queryCtrl: FormControl = new FormControl();
    public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public maxDisplayedOptions: number = 50;

    public controlValue: any;
    @Input() public layoutNode: any;
    private initialValue$: Observable<ISelectOption[]>;
    private searchValues$: Observable<ISelectOption[]>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private jsf: JsonSchemaFormService,
        private http: HttpClient,
    ) {
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public ngOnInit(): void {
        this.settings = Object.assign({
            minQueryLength: 3,
            debounceTime: 300,
            labelField: 'name',
            valueField: 'id',
            url: '',
            readonly: false,
        }, this.layoutNode.options || {});

        this.jsf.initializeControl(this);

        // observable1 get initial data
        const initialData$ = this.fetchOptions({id: this.controlValue}).pipe(
            tap((list) => !environment.production && console.info('[dbg] initial ->', list)),
            tap(() => this.loading$.next(true)),
            map((list) => list.length ? list : []),
            finalize(() => this.loading$.next(false)),
        );

        // if initial value provided, call observable1 otherwise return []
        this.initialValue$ = of(this.controlValue).pipe(
            mergeMap((value) => iif(() => !!value, initialData$, of([]))),
            filter((list) => !!list.length),
            tap((list) => this.checkedOption.setValue(list[0].value)),
        );

        // process search events
        this.searchValues$ = this.queryCtrl.valueChanges
            .pipe(
                tap((val) => !environment.production
                    && console.info(`[dbg] serachValue=${val} -> ${this.valueToTransport(val)}`)),
                filter((val) => val.length > Number(this.settings.minQueryLength)),
                tap(() => this.checkedOption.reset('')),
                tap(() => this.loading$.next(true)),
                debounceTime(this.settings.debounceTime),
                switchMap((query) => this.fetchOptions({searchQuery: this.valueToTransport(query)})),
                tap((list) => !environment.production && console.info('[dbg] listFromSearch ->', list)),
                tap(() => this.loading$.next(false)),
            );

        // use search events of initial values
        this.options$ = merge(this.initialValue$, this.searchValues$)
            .pipe(
                takeUntil(this.destroyed$),
                // will filter processing for prod
                tap((list) => !environment.production
                    && console.info('[dbg] resultList ->', list)),
            );

        this.checkedOption.valueChanges
            .pipe(
                tap((val) => !environment.production
                    && console.info('[dbg] changeValue ->', val)),
                tap((val) => this.jsf.updateValue(this, val)),
                takeUntil(this.destroyed$),
            )
            .subscribe();
    }

    private valueToTransport(val: string): string {
        return btoa(unescape(encodeURIComponent(val)));
    }

    private fetchOptions(query: any): Observable<ISelectOption[]> {
        return this.http.post(this.settings.url, query)
            .pipe(
                map((response) => _.get(response, this.settings.arrayField, [])),
                map((options) => options.map((option) => {
                    return {
                        label: _.get(option, this.settings.labelField, null),
                        value: _.get(option, this.settings.valueField, null),
                    };
                })),
                map((options) => options.filter((option) => option.label !== null && option.value !== null)),
                map((options) => options.length ? options : []),
                catchError(() => of([])),
            );
    }
}
