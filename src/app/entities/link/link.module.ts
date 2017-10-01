import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
    LinkService
} from './';
import {GateSharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        GateSharedModule
    ],
    providers: [
        LinkService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateLinkModule {}
