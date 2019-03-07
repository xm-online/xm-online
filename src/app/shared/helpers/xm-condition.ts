import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'xmCondition' })
export class XmCondition implements PipeTransform {
    transform(condition: string, context?: any): any[] {
        const result = new Function('context', condition)(context);
        return result;
    }
}
