import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
    ContentService
} from './';
import {GateSharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        GateSharedModule
    ],
    providers: [
        ContentService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateContentModule {}
