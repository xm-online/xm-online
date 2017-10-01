import {Component, Injector, Input, OnInit} from '@angular/core';
import {Response} from "@angular/http";
import {XmEntityService} from "../../../entities/xm-entity/xm-entity.service";

@Component({
  selector: 'xm-widget-available-offerings',
  templateUrl: './xm-widget-available-offerings.component.html'
})
export class XmWidgetAvailableOfferingsComponent implements OnInit {
  // @Input() config: any;

  config: any;
  
  constructor(
    private injector: Injector,
    private xmEntityService: XmEntityService,
  ) {
    this.config = this.injector.get('config') || {};
  }

  ngOnInit() {
  }

  onView() {
  }

  onEdit() {
  }

  onRemove() {
  }

}
