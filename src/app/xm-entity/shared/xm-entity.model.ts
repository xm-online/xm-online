import { BaseEntity } from './../../shared';
import { Attachment } from './attachment.model';
import { Calendar } from './calendar.model';
import { Comment } from './comment.model';
import { Event } from './event.model';
import { FunctionContext } from './function-context.model';
import { Link } from './link.model';
import { Location } from './location.model';
import { Rating } from './rating.model';
import { Tag } from './tag.model';
import { Vote } from './vote.model';

export class XmEntity implements BaseEntity {
    constructor(public id?: number,
                public key?: string,
                public typeKey?: string,
                public stateKey?: string,
                public name?: string,
                public startDate?: any,
                public updateDate?: any,
                public endDate?: any,
                public avatarUrl?: string,
                public description?: string,
                public data?: any,
                public removed?: boolean,
                public attachments?: Attachment[],
                public calendars?: Calendar[],
                public locations?: Location[],
                public ratings?: Rating[],
                public tags?: Tag[],
                public comments?: Comment[],
                public votes?: Vote[],
                public sources?: Link[],
                public targets?: Link[],
                public functionContexts?: FunctionContext[],
                public events?: Event[]) {
        this.removed = false;
    }
}
