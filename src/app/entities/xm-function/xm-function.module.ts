import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
    XmFunctionService
} from './';
import {GateSharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        GateSharedModule,
    ],
    providers: [
        XmFunctionService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateXmFunctionModule {}
