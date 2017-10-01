import {Component, Injector, OnInit} from '@angular/core';

import {XmWidgetWeatherService} from "./xm-widget-weather.service";
import {JhiLanguageService} from "ng-jhipster";

@Component({
  selector: 'xm-widget-weather',
  templateUrl: './xm-widget-weather.component.html',
  styleUrls: ['./xm-widget-weather.component.css']
})
export class XmWidgetWeatherComponent implements OnInit {

  config: any;
  weather: any = {};

  constructor(
    private injector: Injector,
    private xmWidgetWeatherService: XmWidgetWeatherService,
    private jhiLanguageService: JhiLanguageService,
  ) {
    this.config = this.injector.get('config') || {};
    this.jhiLanguageService.addLocation('widget-weather');
  }


  ngOnInit() {
    this.xmWidgetWeatherService.get(this.config.city)
      .subscribe(result => {
        this.weather = result;
      })
  }

}
