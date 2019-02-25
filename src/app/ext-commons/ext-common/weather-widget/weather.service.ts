import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

declare let escape: any;
declare let parseInt: any;

@Injectable()
export class WeatherService {

    private WEATHER_URL = 'https://query.yahooapis.com/v1/public/yql?q=';

    constructor(private http: HttpClient) {
    }

    get(location: string = 'Kyiv'): Observable<Response> {
        const query = escape('select * from weather.forecast where woeid in' +
            `(select woeid from geo.places(1) where text='${location}') and u='c'`);
        return this.http.jsonp(this.WEATHER_URL + `${query}&format=json`, 'callback').pipe(map((data: any) => {
            if (data && data.query && data.query.results) {
                const result = data.query.results.channel;
                const weather = result.item.condition.text;

                // convert to meters per hour
                result.wind.speed = parseInt((result.wind.speed * 1000) / 3600, 10);
                if (result.item.condition.temp > 0) {
                    result.item.condition.temp = '+' + result.item.condition.temp;
                }

                if (/clear|sunny/i.test(weather)) {
                    result.type = 'sunny';
                } else if (/Mostly Sunny|Mostly Cloudy/i.test(weather)) {
                    result.type = 'sun';
                } else if (/cloud/i.test(weather)) {
                    result.type = 'cloud';
                } else if (/storm/i.test(weather)) {
                    result.type = 'storm';
                } else if (/shower|rain/i.test(weather)) {
                    result.type = 'rain';
                } else if (/snow/i.test(weather)) {
                    result.type = 'flurry';
                } else {
                    result.type = 'cloud';
                }
                return result;
            }
            return data;
        }));
    }

}
