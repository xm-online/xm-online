import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { FunctionService, XmEntity, XmEntityService } from '../../../xm-entity/';

interface IStatFunction {
    type: 'query' | 'function';
    name?: string;
    query?: string;
    defaultValue?: string;
    errorValue?: string;
}

interface IStat {
    icon: string;
    color: string;
    name: string;
    value: BehaviorSubject<string | number>;
    query?: string;
    function?: IStatFunction;
}

@Component({
    selector: 'xm-stats-widget',
    templateUrl: './stats-widget.component.html',
    styleUrls: ['./stats-widget.component.scss'],
})
export class StatsWidgetComponent implements OnInit {

    public config: any;
    public stats: IStat[] = [];

    constructor(
        private xmEntityService: XmEntityService,
        private functionService: FunctionService) {
    }

    public ngOnInit(): void {
        this.stats = this.config.stats.map((el) => {
            if (el.function) {
                el.value = new BehaviorSubject(el.function.defaultValue ? el.function.defaultValue : '?');
                this.callFunction(el.function).subscribe(el.value);
            } else if (el.query) {
                el.value = new BehaviorSubject('?');
                this.callFunction({type: 'query', query: el.query, errorValue: '?'}).subscribe(el.value);
            } else {
                el.value = new BehaviorSubject('?');
            }
            return el;
        });
    }

    private callFunction(iFunction: IStatFunction): Observable<string | number> {
        switch (iFunction.type) {
            case 'function':
                return this.executeFunction(iFunction);
            case 'query':
                return this.executeQuery(iFunction);
            default:
                return of('?');
        }
    }

    private executeFunction(iFunction: IStatFunction): Observable<string | number> {
        return this.functionService.call(iFunction.name, {}).pipe(
            map((resp) => resp.body),
            map((body) => this.getWidgetValue(body, iFunction)),
            catchError(() => of(iFunction.errorValue ? iFunction.errorValue : '?')),
        );
    }

    private executeQuery(iFunction: IStatFunction): Observable<string | number> {
        return this.xmEntityService.search({
            page: 0,
            query: iFunction.query ? iFunction.query : iFunction.name,
            size: 1,
        }).pipe(
            map((resp: HttpResponse<XmEntity[]>) => resp.headers.get('X-Total-Count')),
            catchError(() => of(iFunction.errorValue ? iFunction.errorValue : '?')),
        );
    }

    private getWidgetValue(data: any, iFunction: IStatFunction): any {
        if (_.has(data, 'data.widget.value')) { return _.get(data, 'data.widget.value'); }
        if (_.has(data, 'data.amount')) { return _.get(data, 'data.amount'); }
        return iFunction.defaultValue;
    }

}
