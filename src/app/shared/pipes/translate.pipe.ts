import { ChangeDetectorRef, Injectable, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe as ngxTranslate, TranslateService } from '@ngx-translate/core';

interface ITranslate {
    en?: string;
    ru?: string;
    uk?: string;

    [locale: string]: string;
}

type Translate = ITranslate | string;

@Injectable()
@Pipe({
    name: 'translate',
    pure: false,
})
export class TranslatePipe implements PipeTransform, OnDestroy {

    private natiVeTranslate: ngxTranslate;

    constructor(protected translate: TranslateService, protected cdr: ChangeDetectorRef) {
        this.natiVeTranslate = new ngxTranslate(this.translate, this.cdr);
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
            return value[this.translate.currentLang];
        } else {
            return this.natiVeTranslate.transform(value, ...args);
        }
    }

    public ngOnDestroy(): void {
        this.natiVeTranslate.ngOnDestroy();
    }
}
