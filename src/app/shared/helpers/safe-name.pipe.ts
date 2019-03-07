import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'safeName'})
export class SafeNamePipe implements PipeTransform {

    transform(name: any): string {
        name = name.replace(/&/g, '&amp;');
        name = name.replace(/>/g, '&gt;');
        name = name.replace(/</g, '&lt;');
        name = name.replace(/"/g, '&quot;');
        name = name.replace(/'/g, '&#039;');
        return name;
    }
}
