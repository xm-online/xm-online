import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { XmSharedModule } from '../shared/shared.module';
import { DashboardService, DashboardWrapperService, DynamicWidgetComponent, WidgetService } from './';
import { XmDashboardRoutingModule } from './xm-dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
    imports: [
        CommonModule,
        XmSharedModule,
        XmDashboardRoutingModule
    ],
    declarations: [
        DynamicWidgetComponent,
        DashboardComponent
    ],
    exports: [
        DynamicWidgetComponent
    ],
    providers: [
        DashboardService,
        DashboardWrapperService,
        WidgetService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class XmDashboardModule {
}
