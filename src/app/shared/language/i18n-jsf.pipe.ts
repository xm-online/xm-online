import { Pipe, PipeTransform } from '@angular/core';
import { Principal } from '../auth/principal.service';
import { I18nNamePipe } from './i18n-name.pipe';

@Pipe({name: 'i18nJsf'})
export class I18nJsfPipe implements PipeTransform {

    constructor(private pipe: I18nNamePipe) {
    }

    public transform(formOrLayoutOrOptions: any, principal: Principal): any {
        return this.transformTitles(formOrLayoutOrOptions, principal);
    }

    public transformTitles(obj: any, principal: any): any {
        for (const property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (property === 'validationMessages') {
                    this.transformValidationMessages(obj[property], principal);
                } else if (typeof obj[property] === 'object' && property !== 'title') {
                    this.transformTitles(obj[property], principal);
                } else {
                    if (property === 'title') {
                        obj[property] = this.pipe.transform(obj[property], principal);
                    }
                }

            }
        }
        return obj;
    }

    public transformValidationMessages(obj: any, principal: any): void {
        for (const property in obj) {
            if (obj.hasOwnProperty(property)) {
                obj[property] = this.pipe.transform(obj[property], principal);
            }
        }
    }

}
