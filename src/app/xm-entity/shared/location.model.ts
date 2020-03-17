import { BaseEntity } from './base-entity';
import { XmEntity } from './xm-entity.model';

export interface Location extends BaseEntity {
    id?: number;
    typeKey?: string;
    countryKey?: string;
    longitude?: number;
    latitude?: number;
    name?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    region?: string;
    zip?: string;
    xmEntity?: XmEntity;
}
