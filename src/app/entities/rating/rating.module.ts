import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
    RatingService
} from './';
import {GateSharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        GateSharedModule
    ],
    providers: [
        RatingService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateRatingModule {}
