import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { XmSharedModule } from '@xm-ngx/shared';
import { XmDashboardModule } from '@xm-ngx/dynamic';
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
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GateHomeModule {
}
