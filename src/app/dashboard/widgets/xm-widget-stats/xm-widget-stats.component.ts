import {Component, Injector, Input, OnInit} from '@angular/core';
import {Response} from "@angular/http";
import {XmEntityService} from "../../../entities/xm-entity/xm-entity.service";
import {JhiLanguageService} from 'ng-jhipster';

@Component({
  selector: 'xm-widget-stats',
  templateUrl: './xm-widget-stats.component.html'
})
export class XmWidgetStatsComponent implements OnInit {

  config: any;
  stats: any[];

  constructor(
    private injector: Injector,
    private xmEntityService: XmEntityService,
    private jhiLanguageService: JhiLanguageService) {
    jhiLanguageService.addLocation('widget-stats');
    this.config = this.injector.get('config') || {};
  }

  ngOnInit() {
      this.stats = this.config.stats.map( el => {
        this.search(el.query).then(result => el.value = result);
        return el;
      });
  }

  search(query: string) {
    return this.xmEntityService.search({
      query: query
    })
      .toPromise()
      .then((resp: Response) => resp.headers.get('X-Total-Count'));
  }

}
