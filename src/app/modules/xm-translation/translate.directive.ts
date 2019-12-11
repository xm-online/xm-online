import { ChangeDetectorRef, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { TranslateDirective as NgxTranslateDirective, TranslateService } from '@ngx-translate/core';

@Directive({
    selector: '[jhiTranslate], [xmTranslate], [translate], [ngx-translate]',
})
export class TranslateDirective extends NgxTranslateDirective implements OnDestroy {
    constructor(public _translateService: TranslateService, element: ElementRef, _ref: ChangeDetectorRef) {
        super(_translateService, element, _ref);
    }

    @Input()
    set translateValues(value: string) {
        this.translateParams = value;
    }

    @Input()
    public set translate(value: string) {
        if (value) {
            if (typeof value === 'object') {
                value = value[this._translateService.currentLang];
            }

            this.key = value;
            this.checkNodes();
        }
    }

    @Input()
    public set jhiTranslate(key: string) {
        this.translate = key;
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
