import { Component, Input, OnInit } from '@angular/core';

import { Principal } from '../../auth/principal.service';
import { I18nNamePipe } from '../../language/i18n-name.pipe';
import { PoweredBy } from './powered-by.model';

@Component({
    selector: 'xm-powered-by',
    templateUrl: './powered-by.component.html',
    styleUrls: ['./powered-by.component.scss'],
})
export class PoweredByComponent implements OnInit {

    @Input() public config: PoweredBy;
    public altText: string;

    constructor(public principal: Principal, protected i18nNamePipe: I18nNamePipe) {}

    public ngOnInit(): void {
        this.altText = this.config && this.config.altText
            ? this.i18nNamePipe.transform(this.config.altText, this.principal)
            : '';
    }

    public redirect(url: string): void {
        if (url) {window.open(url); }
    }
}
