import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
    CommentService
} from './';
import {GateSharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        GateSharedModule
    ],
    providers: [
        CommentService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateCommentModule {}
