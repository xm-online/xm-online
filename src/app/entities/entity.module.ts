import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { GateVoteModule } from './vote/vote.module';
import { GateRatingModule } from './rating/rating.module';
import { GateTagModule } from './tag/tag.module';
import { GateLocationModule } from './location/location.module';
import { GateLinkModule } from './link/link.module';
import { GateEventModule } from './event/event.module';
import { GateContentModule } from './content/content.module';
import { GateCommentModule } from './comment/comment.module';
import { GateCalendarModule } from './calendar/calendar.module';
import { GateAttachmentModule } from './attachment/attachment.module';
import { GateXmEntityModule } from './xm-entity/xm-entity.module';
import { GateDashboardModule } from './dashboard/dashboard.module';
import { GateWidgetModule } from './widget/widget.module';
import { GateProfileModule } from './profile/profile.module';
import { GateDefaultProfileModule } from './default-profile/default-profile.module';
import { GateXmFunctionModule } from './xm-function/xm-function.module';
import { GateTimelineModule } from "./timeline/timeline.module";
import {AriChannelModule} from "./ari-channel/ari-channel.module";
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        GateVoteModule,
        GateRatingModule,
        GateTagModule,
        GateLocationModule,
        GateLinkModule,
        GateEventModule,
        GateContentModule,
        GateCommentModule,
        GateCalendarModule,
        GateAttachmentModule,
        GateXmEntityModule,
        GateXmFunctionModule,
        GateDashboardModule,
        GateWidgetModule,
        GateProfileModule,
        GateDefaultProfileModule,
        GateTimelineModule,
        AriChannelModule
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateEntityModule {}
