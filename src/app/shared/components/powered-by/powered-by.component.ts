import { Component, Input, OnInit } from '@angular/core';

import { PoweredBy } from './powered-by.model';
import { Principal } from '../../auth/principal.service';
import { I18nNamePipe } from '../../language/i18n-name.pipe';

@Component({
    selector: 'xm-powered-by',
    templateUrl: './powered-by.component.html',
    styleUrls: ['./powered-by.component.scss']
})
export class PoweredByComponent implements OnInit {

    @Input() config: PoweredBy;
    altText: string;

    constructor(protected principal: Principal, protected i18nNamePipe: I18nNamePipe) {}

    ngOnInit() {
        this.altText = this.config && this.config.altText ? this.i18nNamePipe.transform(this.config.altText, this.principal) : '';
    }

    redirect(url): void {
        if (url) {window.open(url)}
    }
}
