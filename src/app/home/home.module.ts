import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './';
import {HOME_ROUTE} from "./home.route";
import {GateSharedModule} from "../shared/shared.module";
import {DashboardModule} from "../dashboard/dashboard.module";

@NgModule({
    imports: [
        GateSharedModule,
        DashboardModule,
        RouterModule.forRoot([ HOME_ROUTE ], { useHash: true })
    ],
    declarations: [
        HomeComponent,
    ],
    entryComponents: [
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateHomeModule {}
