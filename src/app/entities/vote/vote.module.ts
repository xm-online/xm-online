import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
    VoteService
} from './';
import {GateSharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        GateSharedModule
    ],
    providers: [
        VoteService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateVoteModule {}
