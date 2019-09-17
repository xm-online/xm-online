import { Pipe, PipeTransform } from '@angular/core';
import { Principal } from '../auth/principal.service';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';

@Pipe({name: 'i18nName'})
export class I18nNamePipe implements PipeTransform {

    translatesFormStorage: any;
    constructor(private translateService: TranslateService,
                private principal: Principal,
                private $sessionStorage: SessionStorageService) {
        try {
            this.translatesFormStorage = JSON.parse($sessionStorage.retrieve(this.translateService.currentLang));
            this.translateService.setTranslation(this.translateService.currentLang, this.translatesFormStorage, true);
        } catch (e) {
            console.error(e);
        }
    }

    transform(name: any, principal: Principal = this.principal): string {
        if (name && name['trKey']) {
            return this.translateService.instant(name['trKey']);
        } else if (name && name[principal.getLangKey()]) {
            return name[principal.getLangKey()];
        } else if (name && name.en) {
            return name.en;
        } else {
            return name;
        }
    }
}
