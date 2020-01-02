import { Component, Input } from '@angular/core';

@Component({
    selector: 'xm-maintenance-view',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.scss'],
})
export class MaintenanceComponent {

    @Input() public show: any;
}
