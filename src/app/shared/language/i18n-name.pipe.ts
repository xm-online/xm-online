import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Translate } from '../../modules/xm-translation/language.service';
import { Principal } from '../auth/principal.service';

@Pipe({name: 'i18nName'})
export class I18nNamePipe implements PipeTransform {

    constructor(private translateService: TranslateService,
                private principal: Principal) {
    }

    /** @deprecated Use the TranslatePipe "translate" instead */
    public transform(name: any | { trKey: Translate }, principal: Principal = this.principal): string {
        if (name && name.trKey) {
            return this.translateService.instant(name.trKey);
        } else if (name && name[principal.getLangKey()]) {
            return name[principal.getLangKey()];
        } else if (name && name.en) {
            return name.en;
        } else {
            return name;
        }
    }
}
