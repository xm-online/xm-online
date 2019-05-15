import { BaseEntity } from './../../shared';
import { Content } from './content.model';
import { XmEntity } from './xm-entity.model';

export class Attachment implements BaseEntity {
    constructor(public id?: number,
                public typeKey?: string,
                public name?: string,
                public contentUrl?: string,
                public description?: string,
                public startDate?: any,
                public endDate?: any,
                public valueContentType?: string,
                public valueContentSize?: number,
                public content?: Content,
                public contentChecksum?: string,
                public xmEntity?: XmEntity,
                public body?: any) {
    }
}
