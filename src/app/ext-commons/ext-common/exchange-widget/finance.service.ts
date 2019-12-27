import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FinanceService {

    private FINANCE_URL: string = 'https://free.currencyconverterapi.com/api/v5/convert?q=';

    constructor(private http: HttpClient) {
    }

    public getRate(from: string, to: string): Observable<any> {
        return this.http.jsonp(this.FINANCE_URL + `${from}_${to}&compact=y`, 'callback')
            .pipe(map((data: any) => {
                if (data && data.query && data.query.results) {
                    return data.query.results.channel;
                }
                return data;
            }));
    }

    public getRates(from: string, to: string[]): Observable<any[]> {
        const rateCalls = [];
        for (const i of to) {
            rateCalls.push(this.getRate(from, i));
        }
        return forkJoin(rateCalls);
    }

}
