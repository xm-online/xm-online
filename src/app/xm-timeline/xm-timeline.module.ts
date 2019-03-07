import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { XmSharedModule } from '../shared/shared.module';
import { TimeAgoService } from './shared/time-ago.service';
import { TimelineService } from './shared/timeline.service';
import { TimelineComponent } from './timeline/timeline.component';

@NgModule({
    imports: [
        CommonModule,
        XmSharedModule
    ],
    declarations: [
        TimelineComponent
    ],
    exports: [
        TimelineComponent
    ],
    providers: [
        TimeAgoService,
        TimelineService
    ]
})
export class XmTimelineModule {
}

