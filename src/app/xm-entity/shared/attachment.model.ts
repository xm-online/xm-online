import { BaseEntity } from './base-entity';
import { Content } from './content.model';
import { XmEntity } from './xm-entity.model';

export interface Attachment<B = any> extends BaseEntity {
    id?: number;
    typeKey?: string;
    name?: string;
    contentUrl?: string;
    description?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    valueContentType?: string;
    valueContentSize?: number;
    content?: Content;
    contentChecksum?: string;
    xmEntity?: XmEntity;
    body?: B;
}
