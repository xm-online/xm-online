import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {DashboardService} from "../entities/dashboard/dashboard.service";
import {Dashboard} from "../entities/dashboard/dashboard.model";

@Component({
  selector: 'xm-dashboards',
  template: `<div></div>`
})
export class DashboardsComponent implements OnInit {

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
  ) { }

  public ngOnInit() {
    this.dashboardService.getAll()
      .subscribe((result: Dashboard[]) => {
        this.router.navigate([`/dashboard`, result.length && result[0].id || 1]);
      });
  }

}
