import { XmEntity } from './xm-entity.model';
import { BaseEntity } from '../../shared';

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
