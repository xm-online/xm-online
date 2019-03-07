import { BaseEntity } from './../../shared';
import { Event } from './event.model';
import { XmEntity } from './xm-entity.model';

export class Calendar implements BaseEntity {
    constructor(public id?: number,
                public typeKey?: string,
                public name?: string,
                public description?: string,
                public startDate?: any,
                public endDate?: any,
                public events?: Event[],
                public xmEntity?: XmEntity) {
    }
}
