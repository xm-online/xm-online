import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
    XmEntityService
} from './';
import {GateSharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        GateSharedModule
    ],
    providers: [
        XmEntityService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateXmEntityModule {}
