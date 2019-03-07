import { BaseEntity } from './../../shared';
import { XmEntity } from './xm-entity.model';

export class Comment implements BaseEntity {
    constructor(public id?: number,
                public typeKey?: string,
                public userKey?: string,
                public message?: string,
                public entryDate?: any,
                public comment?: Comment,
                public replies?: Comment[],
                public xmEntity?: XmEntity) {
    }
}
