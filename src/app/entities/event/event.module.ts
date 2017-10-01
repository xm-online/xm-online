import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
    EventService
} from './';
import {GateSharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        GateSharedModule
    ],
    providers: [
        EventService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateEventModule {}
