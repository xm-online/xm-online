import { BaseEntity } from './base-entity';
import { Vote } from './vote.model';
import { XmEntity } from './xm-entity.model';

export interface Rating extends BaseEntity {
    id?: number;
    typeKey?: string;
    value?: number;
    startDate?: string | Date;
    endDate?: string | Date;
    votes?: Vote[];
    xmEntity?: XmEntity;
}
