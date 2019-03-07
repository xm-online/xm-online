import { BaseEntity } from './../../shared';
import { XmEntity } from './xm-entity.model';

export class Link implements BaseEntity {
    constructor(public id?: number,
                public typeKey?: string,
                public name?: string,
                public description?: string,
                public startDate?: any,
                public endDate?: any,
                public target?: XmEntity,
                public source?: XmEntity) {
    }
}
