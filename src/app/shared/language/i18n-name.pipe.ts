import {Pipe, PipeTransform} from '@angular/core';
import {Principal} from '../auth/principal.service';

@Pipe({name: 'name'})
export class I18nNamePipe implements PipeTransform {

    transform(name: any, principal: Principal): string {
        if (name && name[principal.getLangKey()]) {
            return name[principal.getLangKey()];
        } else if (name && name.en) {
            return name.en;
        } else {
            return name;
        }
    }
}
