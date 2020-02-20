import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Principal } from '../../../auth/principal.service';
import { I18nNamePipe } from '../../../language/i18n-name.pipe';
import { ExtSelectOptions } from './ext-select-options.model';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable()
export class ExtSelectService {

    public static byString(o: any, s: any): any {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, ''); // strip a leading dot
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

    public static controlByKey(key: string, rootFormGroup: FormGroup, dataIndex: number[]): AbstractControl {
        let fieldPath = key;
        // eslint-disable-next-line @typescript-eslint/no-for-in-array
        for (const i in dataIndex) {
            const index: number = dataIndex[i];
            if (fieldPath.indexOf('[]') < 0) {
                break;
            }
            fieldPath = fieldPath.replace('[]', `.${index}`);
        }
        let targetField: AbstractControl = rootFormGroup;
        const pathParts = fieldPath.split('.');
        // eslint-disable-next-line @typescript-eslint/no-for-in-array
        for (const i in pathParts) {
            if (targetField != null) {
                targetField = targetField.get(pathParts[i]);
            } else {
                // eslint-disable-next-line no-console
                console.error(`Field by key ${key} not found`);
                break;
            }
        }
        return targetField;
    }

    constructor(
        private http: HttpClient,
        private principal: Principal,
        private i18nNamePipe: I18nNamePipe,
    ) {}

    public fetchData(options: ExtSelectOptions): Observable<any[]> {
        return this.http.get(options.url, {observe: 'response'}).pipe(
            map((response: HttpResponse<any>) => {
                const json = response.body;
                return this.mapArrayToView(json, options);
            }));
    }

    public mapArrayToView(object: any, options: ExtSelectOptions): any[] {
        let array = object;
        if (options.arrayField) {
            array = ExtSelectService.byString(object, options.arrayField);
        }
        array = array ? array : [];
        const elements = [];
        array.forEach((e) => {
            let label = e;
            let value = e;
            if (options.labelField) {
                label = ExtSelectService.byString(e, options.labelField);
            }
            label = this.i18nNamePipe.transform(label, this.principal);
            if (options.valueField) {
                value = ExtSelectService.byString(value, options.valueField);
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
    }

    public nullSafeLabel(x: any): string {
        return x ? '' + x.label ? '' + x.label : '' : '';
    }

}
