import { BaseEntity } from '../../shared';
import { XmEntity } from './xm-entity.model';

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
