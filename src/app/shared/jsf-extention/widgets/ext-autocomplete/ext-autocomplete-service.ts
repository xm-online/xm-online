import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Principal } from '../../../auth/principal.service';
import { I18nNamePipe } from '../../../language/i18n-name.pipe';
import { ExtAutocompleteOptions } from './ext-autocomplete-options.model';

export function byString(o: any, s: any): any {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    const a = s.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
        const k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

@Injectable()
export class ExtAutocompleteService {

    constructor(
        private http: HttpClient,
        private principal: Principal,
        private i18nNamePipe: I18nNamePipe,
    ) {}

    // tslint:disable-next-line:cognitive-complexity
    public fetchData(options: ExtAutocompleteOptions): Observable<any[]> {
        return this.http.get(options.url, {observe: 'response'}).pipe(map((response: HttpResponse<any>) => {
            const json = response.body;
            let array: any = json;
            if (options.arrayField) {
                array = byString(json, options.arrayField);
            }
            array = array ? array : [];
            const elements = [];
            array.forEach((e) => {
                let label = e;
                let value = e;
                if (options.labelField) {
                    label = byString(e, options.labelField);
                }
                label = this.i18nNamePipe.transform(label, this.principal);
                if (options.valueField) {
                    value = byString(value, options.valueField);
                }
                elements.push({
                    label,
                    value,
                    object: e,
                });
            });
            elements.sort((a, b) => {
                const x = this.nullSafeLabel(a).toLowerCase();
                const y = this.nullSafeLabel(b).toLowerCase();
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            });
            return elements;
        }));
    }

    public nullSafeLabel(x: any): string {
        return x ? '' + x.label ? '' + x.label : '' : '';
    }

}
