import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
    LocationService
} from './';
import {GateSharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        GateSharedModule
    ],
    providers: [
        LocationService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateLocationModule {}
