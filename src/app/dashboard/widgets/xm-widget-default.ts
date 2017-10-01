import {Component, Injector, OnInit} from "@angular/core";

@Component({
  selector: 'xm-widget-default',
  template: `<div>Widget not defined!</div>`
})
export class XmWidgetDefaultComponent implements OnInit {

  config: any;

  constructor(
    private injector: Injector
  ) {
    this.config = this.injector.get('config') || {};
  }

  ngOnInit() {}
}