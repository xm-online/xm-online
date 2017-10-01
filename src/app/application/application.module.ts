import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';
import {GateSharedModule} from "../shared/shared.module";
import {ApplicationComponent} from './application.component';
import {EntityDetailComponent} from './entity-detail.component';
import {EntityDialogComponent, EntityPopupComponent} from './entity-dialog.component';
import {EntityDeleteDialogComponent, EntityDeletePopupComponent} from './entity-delete-dialog.component';
import {EntityPopupService} from './entity-popup.service';
import {ApplicationResolvePagingParams, applicationRoute, entityPopupRoute} from './application.route';
import {JsonSchemaFormModule} from 'angular2-json-schema-form';

import { EntityRatingComponent } from './entity-rating/entity-rating.component';
import { EntityTagComponent } from './entity-tag/entity-tag.component';
import { EntityFormComponent } from './entity-form/entity-form.component';

import { EntityFunctionComponent } from './entity-function/entity-function.component';
import EntityDynamicFunctionComponent from './entity-function/dynamic-entity-function.component';
import {EntityDefaultFunctionComponent} from './entity-function/dynamic-default-entity-function.component';
import {LinkedinDataItemComponent} from './entity-function/extract-linkedin-profile/linkedin-data-item.component';
import {LinkedinProfileComponent} from './entity-function/extract-linkedin-profile/linkedin-profile.component';
import { AreaSquareComponent } from './entity-function/area-square/area-square.component';

import {EntityLocationComponent} from './entity-location/entity-location.component';
import {EntityLocationDialogComponent} from './entity-location/entity-location-dialog.component';
import {EntityLocationDeleteDialogComponent} from './entity-location/entity-location-delete-dialog.component';
import {EntityStateChangeDialogComponent} from './entity-state/entity-state-change-dialog.component';

import {EntityAttachmentComponent} from './entity-attachment/entity-attachment.component';
import {EntityAttachmentDialogComponent} from './entity-attachment/entity-attachment-dialog.component';
import {EntityAttachmentDeleteDialogComponent} from './entity-attachment/entity-attachment-delete-dialog.component';

import {EntityLinkComponent} from './entity-link/entity-link.component';
import {NewEntityLinkDialogComponent} from './entity-link/new-entity-link-dialog.component';
import {EntityTreeViewLinkComponent} from './entity-link/entity-tree-view-link.component';
import {SearchEntityLinkDialogComponent} from './entity-link/search-entity-link-dialog.component';
import {EntityLinkDeleteDialogComponent} from './entity-link/entity-link-delete-dialog.component';

import {EntityCommentComponent} from './entity-comment/entity-comment.component';
import {EntityCommentDialogComponent} from './entity-comment/entity-comment-dialog.component';

import {CalendarComponent} from './entity-calendar/enitity-calendar.component';
import {NewCalendarEventDialog} from './entity-calendar/enitity-calendar-event-dialog.component';
import {EventDetailComponent} from './entity-calendar/event-detail.component';

import {TagInputModule} from 'ngx-chips';
import {RatingModule} from 'ngx-rating';

import { EntityTimelineComponent } from './entity-timeline/entity-timeline.component';
import {RedeemVoucherComponent} from './entity-function/redeem-voucher/redeem-voucher.component';
import { EntityDetailFabComponent } from './entity-detail-fab/entity-detail-fab.component';

const ENTITY_STATES = [
    ...applicationRoute,
    ...entityPopupRoute,
];

@NgModule({
    imports: [
        GateSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: false }),
        TagInputModule,
        JsonSchemaFormModule,
        RatingModule
    ],
    declarations: [
        ApplicationComponent,
        EntityDetailComponent,
        EntityDialogComponent,
        EntityDeleteDialogComponent,
        EntityPopupComponent,
        EntityDeletePopupComponent,
        EntityRatingComponent,
        EntityTagComponent,
        EntityFormComponent,
        EntityFunctionComponent,
        EntityDynamicFunctionComponent,
        EntityDefaultFunctionComponent,
        EntityLocationComponent,
        EntityLocationDialogComponent,
        EntityLocationDeleteDialogComponent,
        EntityStateChangeDialogComponent,
        EntityAttachmentComponent,
        EntityAttachmentDialogComponent,
        EntityAttachmentDeleteDialogComponent,
        EntityLinkComponent,
        NewEntityLinkDialogComponent,
        SearchEntityLinkDialogComponent,
        EntityTreeViewLinkComponent,
        EntityLinkDeleteDialogComponent,
        EntityCommentComponent,
        EntityCommentDialogComponent,
        CalendarComponent,
        NewCalendarEventDialog,
        EventDetailComponent,
        LinkedinProfileComponent,
        LinkedinDataItemComponent,
        RedeemVoucherComponent,
        AreaSquareComponent,
        EntityTimelineComponent,
        EntityDetailFabComponent,
    ],
    entryComponents: [
        ApplicationComponent,
        EntityDialogComponent,
        EntityPopupComponent,
        EntityDeleteDialogComponent,
        EntityDeletePopupComponent,
        EntityLocationDialogComponent,
        EntityLocationDeleteDialogComponent,
        EntityStateChangeDialogComponent,
        EntityAttachmentDialogComponent,
        EntityAttachmentDeleteDialogComponent,
        NewEntityLinkDialogComponent,
        SearchEntityLinkDialogComponent,
        EntityLinkDeleteDialogComponent,
        EntityCommentDialogComponent,
        CalendarComponent,
        NewCalendarEventDialog,
        EventDetailComponent
    ],
    providers: [
        EntityPopupService,
        ApplicationResolvePagingParams
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ApplicationModule {}
