import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
    ProfileService
} from './';
import {GateSharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        GateSharedModule
    ],
    providers: [
        ProfileService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateProfileModule {}
