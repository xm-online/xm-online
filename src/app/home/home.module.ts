import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { XmDashboardModule } from '@xm-ngx/dynamic';
import { XmSharedModule } from '@xm-ngx/shared';
import { HomeComponent } from './';
import { HOME_ROUTE } from './home.route';

@NgModule({
    imports: [
        XmSharedModule,
        RouterModule.forChild([HOME_ROUTE]),
        XmDashboardModule,
    ],
    declarations: [
        HomeComponent,
    ],
    entryComponents: [],
    providers: [],
})
export class GateHomeModule {
}
