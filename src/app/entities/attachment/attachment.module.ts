import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
    AttachmentService
} from './';
import {GateSharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        GateSharedModule
    ],
    providers: [
        AttachmentService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateAttachmentModule {}
