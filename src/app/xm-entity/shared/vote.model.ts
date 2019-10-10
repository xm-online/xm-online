import { BaseEntity } from '../../shared';
import { Rating } from './rating.model';
import { XmEntity } from './xm-entity.model';

export interface Vote extends BaseEntity {
    id?: number;
    userKey?: string;
    value?: number;
    message?: string;
    entryDate?: string | Date;
    rating?: Rating;
    xmEntity?: XmEntity;
}
