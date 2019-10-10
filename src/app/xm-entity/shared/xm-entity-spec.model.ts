import { BaseSpec } from './../../shared';
import { AttachmentSpec } from './attachment-spec.model';
import { CalendarSpec } from './calendar-spec.model';
import { CommentSpec } from './comment-spec.model';
import { FastSearchSpec } from './fast-search-spec.model';
import { FunctionSpec } from './function-spec.model';
import { LinkSpec } from './link-spec.model';
import { LocationSpec } from './location-spec.model';
import { RatingSpec } from './rating-spec.model';
import { StateSpec } from './state-spec.model';
import { TagSpec } from './tag-spec.model';

export interface XmEntitySpec extends BaseSpec {
    key?: string,
    name?: any,
    isApp?: boolean,
    isAbstract?: boolean,
    isAvatarEnabled?: boolean,
    fastSearch?: FastSearchSpec[],
    icon?: string,
    dataSpec?: string,
    dataForm?: string,
    functions?: FunctionSpec[],
    attachments?: AttachmentSpec[],
    calendars?: CalendarSpec[],
    links?: LinkSpec[],
    locations?: LocationSpec[],
    ratings?: RatingSpec[],
    states?: StateSpec[],
    tags?: TagSpec[],
    comments?: CommentSpec[],
    pluralName?: string,
    nameValidationPattern?: string,
    descriptionPattern?: string
}
