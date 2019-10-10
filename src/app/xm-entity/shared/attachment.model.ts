import { BaseEntity } from '../../shared';
import { XmEntity } from './xm-entity.model';
import { Content } from './content.model';

export interface Attachment extends BaseEntity {
    id?: number,
    typeKey?: string,
    name?: string,
    contentUrl?: string,
    description?: string,
    startDate?: string | Date,
    endDate?: string | Date,
    valueContentType?: string,
    valueContentSize?: number,
    content?: Content,
    contentChecksum?: string,
    xmEntity?: XmEntity,
    body?: any;
}
