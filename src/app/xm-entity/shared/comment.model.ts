import { BaseEntity } from './base-entity';
import { XmEntity } from './xm-entity.model';

export interface Comment extends BaseEntity {
    id?: number;
    typeKey?: string;
    userKey?: string;
    message?: string;
    entryDate?: string | Date;
    comment?: Comment;
    replies?: Comment[];
    xmEntity?: XmEntity;
}
