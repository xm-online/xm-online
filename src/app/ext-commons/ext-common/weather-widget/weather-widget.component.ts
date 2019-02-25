import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { WeatherService } from './weather.service';

@Component({
    selector: 'xm-weather-widget',
    templateUrl: './weather-widget.component.html',
    styleUrls: ['./weather-widget.component.scss']
})
export class WeatherWidgetComponent implements OnInit {

    config: any;
    weather: any = {};
    showLoader = true;

    constructor(private weatherService: WeatherService) {
    }

    ngOnInit() {
        this.weatherService.get(this.config.city).pipe(finalize(() => this.showLoader = false))
            .subscribe(
                result => this.weather = result,
                error => this.showLoader = false
            );
    }

}
