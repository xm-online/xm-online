import { Component, OnInit } from '@angular/core';

import { FinanceService } from './finance.service';

declare let $: any;

@Component({
    selector: 'xm-exchange-widget',
    templateUrl: './exchange-widget.component.html',
    styleUrls: ['./exchange-widget.component.scss']
})
export class ExchangeWidgetComponent implements OnInit {

    isShowCalc = false;
    config: any;

    calc: any = {fromValue: 1};
    currency: any = {};

    constructor(private financeService: FinanceService) {
    }

    ngOnInit() {
        const currencyList = this.config.currencyList ? this.config.currencyList.slice() : ['UAH', 'USD', 'EUR', 'BTC'];
        this.currency.all = currencyList.slice();
        this.currency.from = currencyList.shift();
        this.currency.to = currencyList.slice();
        this.currency.selected = this.currency.from.slice();
        this.currency.available = currencyList.slice();

        this.financeService.getRates(this.currency.from, this.currency.to).subscribe(result => {
            this.currency.rates = [...result];

            // TODO change to the mat-select
            setTimeout(() => $('.selectpicker').selectpicker('refresh'), 50);
        });
    }

    onChangeCurrency(value) {
        this.currency.selected = value.target.value;
        this.currency.available = this.currency.all.filter(c => c !== this.currency.selected);
    }

    getRate(from?, to?) {
        from = from ? from : this.currency.selected;
        if (from === this.currency.from) {
            const code = from + '_' + to;
            const rate = this.currency.rates.filter(r => r.hasOwnProperty(code)).shift();
            return rate ? rate[code].val : null;
        } else if (to === this.currency.from) {
            const code = to + '_' + from;
            const rate = this.currency.rates.filter(r => r.hasOwnProperty(code)).shift();
            return rate ? 1 / rate[code].val : null;
        } else {
            const code1 = this.currency.from + '_' + from;
            const code2 = this.currency.from + '_' + to;
            const rate1 = this.currency.rates.filter(r => r.hasOwnProperty(code1)).shift();
            const rate2 = this.currency.rates.filter(r => r.hasOwnProperty(code2)).shift();
            return rate1 && rate2 ? rate1[code1].val / rate2[code2].val : null;
        }
    }

    onChangeCalc() {
        if (this.calc.fromValue && this.calc.from && this.calc.to) {
            this.calc.toValue = parseFloat((this.calc.fromValue * this.getRate(this.calc.from, this.calc.to)).toFixed(4));
        }
    }

}
