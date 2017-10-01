import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
    TimelineService,
} from './timeline.service';
import {TimeAgoService} from "./timeAgo.service";
import {GateSharedModule} from "../../shared/shared.module";

const ENTITY_STATES = [
];

@NgModule({
    imports: [
        GateSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
    ],
    entryComponents: [
    ],
    providers: [
        TimelineService,
        TimeAgoService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateTimelineModule {}
