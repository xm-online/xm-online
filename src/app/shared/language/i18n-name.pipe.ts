import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Principal } from '../auth/principal.service';

@Pipe({name: 'i18nName'})
export class I18nNamePipe implements PipeTransform {

    private translatesFormStorage: any;
    constructor(private translateService: TranslateService, private $sessionStorage: SessionStorageService) {
        try {
            this.translatesFormStorage = JSON.parse($sessionStorage.retrieve(this.translateService.currentLang));
            this.translateService.setTranslation(this.translateService.currentLang, this.translatesFormStorage, true);
        } catch (e) {
            console.error(e);
        }
    }

    public transform(name: any, principal: Principal): string {
        const KEY = 'trKey';
        if (name && name[KEY]) {
            return this.translateService.instant(name[KEY]);
        } else if (name && name[principal.getLangKey()]) {
            return name[principal.getLangKey()];
        } else if (name && name.en) {
            return name.en;
        } else {
            return name;
        }
    }
}
