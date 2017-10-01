import { Injectable } from '@angular/core';
import { Response, Jsonp } from '@angular/http';
import { Observable } from 'rxjs/Rx';

declare let escape: any;
declare let parseInt: any;

@Injectable()
export class XmWidgetWeatherService {

  private reqCount = 0;

  constructor(
    private jsonp: Jsonp,
  ) { }

  get(location: string='Kyiv'): Observable<Response> {
    let query = escape(`select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='${location}') and u='c'`),
      url = `https://query.yahooapis.com/v1/public/yql?q=${query}&format=json&q=&callback=__ng_jsonp__.__req${this.reqCount++}.finished`
    ;

    return this.jsonp.get(url)
      .map((resp: any) => {
        let data = resp.json();
        if (data && data.query && data.query.results){
          let result = data.query.results.channel, weather = result.item.condition.text;
          // convert to meters per hour
          result.wind.speed = parseInt((result.wind.speed * 1000)/3600, 10);
          if (result.item.condition.temp > 0) result.item.condition.temp = "+" + result.item.condition.temp;

          if (/clear|sunny/i.test(weather)){
            result.type = "sunny";
          } else if (/Mostly Sunny|Mostly Cloudy/i.test(weather)){
            result.type = "sun";
          } else if (/cloud/i.test(weather)){
            result.type = "cloud";
          } else if (/storm/i.test(weather)){
            result.type = "storm";
          } else if (/shower|rain/i.test(weather)){
            result.type = "rain";
          } else if (/snow/i.test(weather)){
            result.type = "flurry";
          } else {
            result.type = "cloud";
          }
          return result;
        }
        return data;
      });
  }

}
