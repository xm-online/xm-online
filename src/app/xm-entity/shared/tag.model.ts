import { BaseEntity } from './../../shared';
import { XmEntity } from './xm-entity.model';

export class Tag implements BaseEntity {
    constructor(public id?: number,
                public typeKey?: string,
                public name?: string,
                public startDate?: any,
                public xmEntity?: XmEntity) {
    }
}
