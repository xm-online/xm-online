import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
    DashboardService
} from './';
import {GateSharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        GateSharedModule
    ],
    providers: [
        DashboardService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateDashboardModule {}
