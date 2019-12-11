import { ChangeDetectorRef, Injectable, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe as NgxTranslate, TranslateService } from '@ngx-translate/core';

import { Translate } from './language.service';

@Injectable()
@Pipe({
    name: 'translate',
    pure: false,
})
export class TranslatePipe extends NgxTranslate implements PipeTransform, OnDestroy {

    constructor(protected translateService: TranslateService, cdr: ChangeDetectorRef) {
        super(translateService, cdr);
    }

    /**
     * @params {(string | object)} value
     * @description translate
     * @example
     *  // returns Hi
     *  {{ {en: 'Hi', ru: 'хай'} | translate }}
     * @example
     *  // returns Accept
     *  {{ 'global.common.accept' | translate }}
     */
    public transform(value: Translate, ...args: any[]): string | any {
        if (typeof value === 'object') {
            return value[this.translateService.currentLang];
        } else {
            return super.transform(value, ...args);
        }
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
