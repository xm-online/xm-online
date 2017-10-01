import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertService } from 'ng-jhipster';

@Component({
    selector: 'xm-alerts',
    templateUrl: './xm-alerts.component.html'
})
export class JhiAlertComponent implements OnInit, OnDestroy {
    alerts: any[];

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alerts = this.alertService.get();
    }

    ngOnDestroy() {
        this.alerts = [];
    }

}
