import {Component, Injector, OnInit} from '@angular/core';
import {Exchange, XmWidgetExchangeService} from "./xm-widget-exchange.service";
import {JhiLanguageService} from "ng-jhipster";

declare let $:any;

@Component({
    selector: 'xm-widget-exchange-calculator',
    templateUrl: './xm-widget-exchange.component.html',
    styleUrls: ['./xm-widget-exchange.component.css']
})
export class XmWidgetExchangeComponent implements OnInit {

    isShowCalc: boolean = false;
    config: any;
    calc: any = { fromValue: 1 };
    currency: any = {};
    private currencyList: Exchange[];

    constructor(
        private injector: Injector,
        private xmWidgetExchangeService: XmWidgetExchangeService,
        private jhiLanguageService: JhiLanguageService,
    ) {
        this.config = this.injector.get('config') || {};
        this.jhiLanguageService.addLocation('widget-exchange');
    }

    ngOnInit() {
        let availableCode = this.config.currencyList ? this.config.currencyList.slice() : ["UAH", "USD", "EUR"];
        this.xmWidgetExchangeService.get(availableCode)
            .subscribe((result: Exchange[]) => {
                this.currencyList = [...result];
                this.calc.available = [...result];
                this.currency.available = [...result];
                this.currency.displayed = result.splice(1);
                this.currency.selected = this.currency.available[0];

                setTimeout(() => {
                    const selectpicker = $('.wdt-exchange-selectpicker');
                    selectpicker.length && selectpicker.selectpicker();
                }, 1000);
            })
    }

    onChangeCurrency () {
        let selected = this.currency.selected;
        this.currency.displayed = [...this.currencyList].map(el => {
            if (el.cc != selected.cc) {
                let currency = Object.assign({}, el);
                currency.rate = parseFloat((currency.rate / selected.rate).toFixed(4));
                return currency;
            }
        }).filter(el => !!el);
    }

    onShowCalc () {
        this.isShowCalc = !this.isShowCalc;
        /*if (this.isShowCalc) {
         this.onChangeCalcFrom(this.currency.selected);
         }*/
    }

    onChangeCalcFrom (value) {
        let selected = Object.assign({}, this.currencyList.find(el => el.cc == value.cc));
        this.calc.available = this.currencyList.map(el => {
            let currency = Object.assign({}, el);
            currency.rate = selected.rate / currency.rate;
            return currency;
        });
        this.calc.from = this.calc.available.find(el => el.cc == value.cc);
        this.calc.to && (this.calc.to = this.calc.available.find(el => el.cc == this.calc.to.cc));
        this.onChangeCalc();
    }

    onChangeCalc (){
        let calc = this.calc;
        if (calc.fromValue && calc.from && calc.to) {
            calc.toValue = parseFloat((calc.fromValue * calc.to.rate).toFixed(4));
        }
    }

}
