import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";

export class Exchange {
    constructor(
        public r030?: number,
        public txt?: string,
        public rate?: number,
        public cc?: string,
        public exchangedate?: string,
    ){ }
}

@Injectable()
export class XmWidgetExchangeService {

    private resourceUrl = `NBUStatService/v1/statdirectory/exchange?json`;

    constructor(
        private http: Http,
    ) { }

    get(availableCode: string[] = []): Observable<Exchange[]> {
        return this.http.get(this.resourceUrl)
            .map((resp: any) => {
                let result = resp.json();
                result.push({"r030":1,"txt":"Hryvnia","rate":1,"cc":"UAH","exchangedate":""});
                if (availableCode.length) {
                    return availableCode
                        .map(code => result.find(el => el.cc.toUpperCase() == code.toUpperCase()))
                        .filter(el => {
                            // el.txt = `xmApp.widget.exchange.codes.${el.cc}`;
                            return !!el;
                        });
                } else {
                    return result;
                }
            });
    }

}
