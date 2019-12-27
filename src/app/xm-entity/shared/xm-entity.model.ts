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

export interface XmEntity extends BaseEntity {
    state?: any;
    type?: any;
    id?: number;
    key?: string;
    typeKey?: string;
    stateKey?: string;
    name?: string;
    startDate?: string | Date;
    updateDate?: string | Date;
    endDate?: string | Date;
    avatarUrl?: string;
    description?: string;
    data?: any;
    removed?: boolean;
    attachments?: Attachment[];
    calendars?: Calendar[];
    locations?: Location[];
    ratings?: Rating[];
    tags?: Tag[];
    comments?: Comment[];
    votes?: Vote[];
    sources?: Link[];
    targets?: Link[];
    functionContexts?: FunctionContext[];
    events?: Event[];
}
