import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AttachmentService } from './attachment.service';
import { CalendarService } from './calendar.service';
import { CommentService } from './comment.service';
import { ContentService } from './content.service';
import { EventService } from './event.service';
import { FunctionContextService } from './function-context.service';
import { FunctionService } from './function.service';
import { LinkService } from './link.service';
import { LocationService } from './location.service';
import { RatingService } from './rating.service';
import { TagService } from './tag.service';
import { VoteService } from './vote.service';
import { XmEntitySpecWrapperService } from './xm-entity-spec-wrapper.service';
import { XmEntitySpecService } from './xm-entity-spec.service';
import { XmEntityService } from './xm-entity.service';

@NgModule({
    imports: [CommonModule],
    providers: [
        AttachmentService,
        CalendarService,
        CommentService,
        ContentService,
        EventService,
        FunctionService,
        FunctionContextService,
        LinkService,
        LocationService,
        RatingService,
        TagService,
        VoteService,
        XmEntityService,
        XmEntitySpecService,
        XmEntitySpecWrapperService,
    ],
})
export class XmEntityModule {
}
