import * as _ from 'lodash';
import { FieldOptions } from '../../xm-entity/entity-list-card/entity-list-card-options.model';
import { transpilingForIE } from '../jsf-extention';

function fieldValueToString(field: FieldOptions, value: any): any {
    if (field && field.func) {
        try {
            return (new Function('value', `return ${field.func};`))(value);
        } catch (e) {
            const code = transpilingForIE(field.func, value);
            return (new Function('value', `return ${code}`))(value);
        }
    }
    return value;
}

export const getFieldValue = (xmEntity: any = {}, field: FieldOptions): any => {
    const value = _.get(xmEntity, field.field);

    return value ? (value instanceof Date
        ? value.toISOString().replace(/T/, ' ').split('.').shift() : fieldValueToString(field, value)) : '';
};
