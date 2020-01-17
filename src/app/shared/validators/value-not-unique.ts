import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { Directive, Input } from '@angular/core';

/* eslint @typescript-eslint/no-use-before-define: 0 */

@Directive({
    selector: '[xmUniqueValue]',
    providers: [{provide: NG_VALIDATORS, useExisting: ValueNotUniqueDirective, multi: true}]
})
export class ValueNotUniqueDirective implements Validator {
    @Input() public xmUniqueValue: boolean;

    validate(control: AbstractControl): { [key: string]: any } | null {
        const notUnique = control.value && this.xmUniqueValue;
        return notUnique ? { valueNotUnique: true } : null;
    }
}
