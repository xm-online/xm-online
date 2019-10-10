import { XmEntity } from './xm-entity.model';
import { BaseEntity } from '../../shared';

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
