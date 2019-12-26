import { BaseEntity } from '../../shared';
import { XmEntity } from './xm-entity.model';

export interface Link extends BaseEntity {
    id?: number;
    typeKey?: string;
    name?: string;
    description?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    target?: XmEntity;
    source?: XmEntity;
}
