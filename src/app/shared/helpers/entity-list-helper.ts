import {FieldOptions} from '../../xm-entity/entity-list-card/entity-list-card-options.model';
import {transpilingForIE} from '../jsf-extention';
import * as _ from 'lodash'

function fieldValueToString(field: FieldOptions, value) {
    if (field && field.func) {
        try {
            return (new Function('value', `return ${field.func};`))(value);
        } catch (e) {
            // console.log('--------------- e fieldValueToString', field.func);
            const code = transpilingForIE(field.func, value);
            // console.log('--------------- code', code);
            return (new Function('value', `return ${code}`))(value);
        }
    }
    return value;
}

export const getFieldValue  = (xmEntity: any = {}, field: FieldOptions): any => {
    const value = _.get(xmEntity, field.field);

    return value ? (value instanceof Date
        ? value.toISOString().replace(/T/, ' ').split('.').shift() : fieldValueToString(field, value)) : '';
};
