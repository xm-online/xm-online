import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { LoaderModule } from '@xm-ngx/components/loader';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { XmSharedModule } from '@xm-ngx/shared';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DynamicWidgetComponent } from './dynamic-widget/dynamic-widget.component';
import { DashboardWrapperService } from './shared/dashboard-wrapper.service';
import { DashboardService } from './shared/dashboard.service';
import { WidgetService } from './shared/widget.service';
import { XmDashboardRoutingModule } from './xm-dashboard-routing.module';

@NgModule({
    imports: [
        CommonModule,
        XmSharedModule,
        XmDashboardRoutingModule,
        LoaderModule,
        NoDataModule,
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
