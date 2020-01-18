import { Pipe, PipeTransform } from '@angular/core';
import { Spec } from '../../xm-entity';

@Pipe({name: 'xmEntityIcon'})
export class XmEntityIconPipe implements PipeTransform {

    public transform(typeKey: string, spec: Spec): string {
        const typeMatched = spec.types.filter((t) => t.key === typeKey);
        const xmEntitySpec = (typeMatched && typeMatched.length > 0) ? typeMatched.shift() : {};
        return xmEntitySpec.icon || '';
    }

}
