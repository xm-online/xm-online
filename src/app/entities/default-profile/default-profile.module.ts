import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
    DefaultProfileService
} from './';
import {GateSharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        GateSharedModule
    ],
    providers: [
        DefaultProfileService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateDefaultProfileModule {}
