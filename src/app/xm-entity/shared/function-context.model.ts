import { XmEntity } from './xm-entity.model';
import { BaseEntity } from '../../shared';

export interface FunctionContext extends BaseEntity {
    id?: number;
    key?: string;
    typeKey?: string;
    description?: string;
    startDate?: string | Date;
    updateDate?: string | Date;
    endDate?: string | Date;
    data?: any;
    xmEntity?: XmEntity;
}

