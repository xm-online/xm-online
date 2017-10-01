import { Component, OnInit } from '@angular/core';
import {JhiLanguageService} from 'ng-jhipster';

@Component({
  selector: 'xm-widget-welcome',
  templateUrl: './xm-widget-welcome.component.html'
})
export class XmWidgetWelcomeComponent implements OnInit {

  constructor(
      private jhiLanguageService: JhiLanguageService,
  ) {
      this.jhiLanguageService.addLocation('home');
  }

  ngOnInit() {
  }

}
