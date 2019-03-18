import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'xm-maintenance-view',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

    @Input() show: any;

    constructor() {
    }

    ngOnInit() {
    }

}
