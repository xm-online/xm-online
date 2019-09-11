import { BaseEntity } from './../../shared';
import { XmEntity } from './xm-entity.model';

export interface Tag extends BaseEntity {
    id?: number;
    typeKey?: string;
    name?: string;
    startDate?: string | Date;
    xmEntity?: XmEntity;
}
