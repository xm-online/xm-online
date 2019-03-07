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

export class XmEntitySpec implements BaseSpec {
    constructor(public key?: string,
                public name?: any,
                public isApp?: boolean,
                public isAbstract?: boolean,
                public isAvatarEnabled?: boolean,
                public fastSearch?: FastSearchSpec[],
                public icon?: string,
                public dataSpec?: string,
                public dataForm?: string,
                public functions?: FunctionSpec[],
                public attachments?: AttachmentSpec[],
                public calendars?: CalendarSpec[],
                public links?: LinkSpec[],
                public locations?: LocationSpec[],
                public ratings?: RatingSpec[],
                public states?: StateSpec[],
                public tags?: TagSpec[],
                public comments?: CommentSpec[],
                public pluralName?: string,
                public nameValidationPattern?: string,
                public descriptionPattern?: string) {

    }
}
