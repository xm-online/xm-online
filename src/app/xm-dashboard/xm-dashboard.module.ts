import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';

import { XmSharedModule } from '../shared/shared.module';
import { DashboardService, DashboardWrapperService, DynamicWidgetComponent, WidgetService } from './';
import { DashboardComponent } from './dashboard/dashboard.component';
import { XmDashboardRoutingModule } from './xm-dashboard-routing.module';

@NgModule({
    imports: [
        CommonModule,
        XmSharedModule,
        XmDashboardRoutingModule,
    ],
    declarations: [
        DynamicWidgetComponent,
        DashboardComponent,
    ],
    exports: [
        DynamicWidgetComponent,
    ],
    providers: [
        WidgetService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class XmDashboardModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: XmDashboardModule,
            providers: [
                DashboardService,
                DashboardWrapperService,
            ],
        };
    }
}
