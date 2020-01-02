import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'xmCondition' })
export class XmCondition implements PipeTransform {
    public transform(condition: string, context?: any): any[] {
        return new Function('context', condition)(context);
    }
}
