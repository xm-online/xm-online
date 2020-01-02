import { FieldOptions } from '../../xm-entity/entity-list-card/entity-list-card-options.model';
import { getFieldValue } from './entity-list-helper';

describe('EntityListHelper', () => {

    describe(' getFieldValue()', () => {
        const testObject = {
            goods: {
                fruit: {
                    apples: 25,
                    oranges: 43,
                },
                deliveryDate: new Date('2019-01-26'),
                customFunctionProperty: {
                    userNames: ['John Doe', 'Mary Sue'],
                },

            },
        };

        it('should fetch string value of specified field', () => {
            // get nested
            const applesField: FieldOptions = {field: 'goods.fruit.apples', title: 'Apples'};
            expect(getFieldValue(testObject, applesField)).toEqual(25);

        });

        it('should fetch date in YYYY-MM-DD HH:MM:SS format', () => {
            // transform date
            const dateField: FieldOptions = {field: 'goods.deliveryDate', title: 'Delivery date'};
            expect(getFieldValue(testObject, dateField))
                .toEqual('2019-01-26 00:00:00');
        });

        it('should fetch value with a custom function', () => {
            // use a function
            const customFunctionField: FieldOptions = {
                field: 'goods.customFunctionProperty',
                title: 'Greeting with a custom function',
            };
            customFunctionField.func = '"Hello, " + value.userNames.join(" and ") + "!"';

            expect(getFieldValue(testObject, customFunctionField))
                .toEqual('Hello, John Doe and Mary Sue!');

        });

        it('should return an empty string when nothing found', () => {
            const notExistingField = {field: 'field.does.not.exist'};
            expect(getFieldValue(testObject, notExistingField))
                .toEqual('');
        });
    });

});
