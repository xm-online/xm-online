import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
    CalendarService
} from './';
import {GateSharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        GateSharedModule
    ],
    providers: [
        CalendarService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateCalendarModule {}
