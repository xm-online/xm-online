import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmSharedModule } from '@xm-ngx/shared';
import { MaintenanceComponent } from './maintenance.component';


@NgModule({
    declarations: [MaintenanceComponent],
    exports: [MaintenanceComponent],
    imports: [
        XmSharedModule,
        CommonModule,
    ],
})
export class XmMaintenanceViewModule {
}
