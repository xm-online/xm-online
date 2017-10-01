import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
    TagService
} from './';
import {GateSharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        GateSharedModule
    ],
    providers: [
        TagService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateTagModule {}
