import { BaseEntity } from './base-entity';

export interface Content extends BaseEntity {
    id?: number;
    valueContentType?: string;
    value?: any;
}
