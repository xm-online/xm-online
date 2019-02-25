import { BaseEntity } from './../../shared';
import { XmEntity } from './xm-entity.model';

export class FunctionContext implements BaseEntity {
    constructor(public id?: number,
                public key?: string,
                public typeKey?: string,
                public description?: string,
                public startDate?: any,
                public updateDate?: any,
                public endDate?: any,
                public data?: any,
                public xmEntity?: XmEntity) {
    }
}
