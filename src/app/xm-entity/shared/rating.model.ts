import { BaseEntity } from './../../shared';
import { Vote } from './vote.model';
import { XmEntity } from './xm-entity.model';

export class Rating implements BaseEntity {
    constructor(public id?: number,
                public typeKey?: string,
                public value?: number,
                public startDate?: any,
                public endDate?: any,
                public votes?: Vote[],
                public xmEntity?: XmEntity) {
    }
}
