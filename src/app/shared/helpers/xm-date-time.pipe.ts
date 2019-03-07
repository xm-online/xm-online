import { Pipe, PipeTransform } from '@angular/core';

import { Principal } from '../auth/principal.service';
import { XmConfigService } from '../index';

import * as moment from 'moment';

/**
 * Pipe is used to display formatted date
 * It accepts two optional params: format?: string (moment.js) and offset?: string
 * If used without params, would be taken from account in Principal
 * and formating also can be override from config UI
 **/

@Pipe({name: 'xmDateTime'})
export class XmDateTimePipe implements PipeTransform {

    account: any;
    dicFormats: any;
    dicFormatsConfig: any;

    constructor(private principal: Principal,
                private xmConfigService: XmConfigService) {
        this.principal.identity().then((account) => this.account = account || {langKey: 'en'});
        this.dicFormats = {en: 'MM/DD/YYYY HH:mm',  ru: 'DD.MM.YYYY HH:mm', uk: 'DD.MM.YYYY HH:mm'};
        this.xmConfigService.getUiConfig().subscribe(resp => this.dicFormatsConfig = resp.datesFormats || {});
    }

    transform(time: any, format?: string, offset?: string): any {
        const timeMoment = moment(time);
        timeMoment.utc();
        timeMoment.utcOffset(offset ? offset : this.getOffset());
        return timeMoment.format(format ? format : this.getDefaultFormat());
    }

    private getOffset(): string {
        return this.account.timeZoneOffset || '';
    }

    private getDefaultFormat(): string {
        const lang = this.account.langKey;
        let format = this.dicFormats['en'];
        if (lang in this.dicFormats) {format =  this.dicFormats[lang]}
        if (lang in this.dicFormatsConfig) {format =  this.dicFormatsConfig[lang]}
        return format;
    }
}
