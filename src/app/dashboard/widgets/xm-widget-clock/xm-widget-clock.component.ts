import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {JhiLanguageService} from "ng-jhipster";

@Component({
  selector: 'xm-widget-clock',
  template: `
    <div class="card widget-card-weather">
      <div class="card-header card-header-icon" data-background-color="primary">
        <i class="material-icons">access_time</i>
      </div>
      <div class="card-content">
        <h4 class="card-title"><span jhiTranslate="xmApp.widgetClock.title">Clock</span></h4>
        <div class="row">
          <div class="time">{{clock}}</div>  
        </div>
      </div>
    </div>
  `,
  styles: [`
    .time {
      text-align: center;
      font-size: 22px;
    }
  `]
})
export class XmWidgetClockComponent implements OnInit {

  clock: any;
  private subscription: any;

  constructor(
      private jhiLanguageService: JhiLanguageService,
  ) {
      this.jhiLanguageService.addLocation('widget-clock');
  }

  ngOnInit() {
    this.subscription = Observable
      .interval(1000).map(tick => new Date())
      .share()
      .subscribe(result => {
        this.clock = result.toLocaleString();
      })

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
