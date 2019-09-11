import { BaseEntity } from './../../shared';

export interface Content extends BaseEntity {
    id?: number;
    valueContentType?: string;
    value?: any;
}
