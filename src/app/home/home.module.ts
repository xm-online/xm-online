import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { XmSharedModule } from '../shared/shared.module';
import { XmDashboardModule } from '../xm-dashboard/xm-dashboard.module';
import { HomeComponent } from './';
import { HOME_ROUTE } from './home.route';

@NgModule({
    imports: [
        XmSharedModule,
        RouterModule.forRoot([HOME_ROUTE], {useHash: false}),
        XmDashboardModule
    ],
    declarations: [
        HomeComponent
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateHomeModule {
}
