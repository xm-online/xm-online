import { BaseEntity } from './../../shared';
import { Rating } from './rating.model';
import { XmEntity } from './xm-entity.model';

export class Vote implements BaseEntity {
    constructor(public id?: number,
                public userKey?: string,
                public value?: number,
                public message?: string,
                public entryDate?: any,
                public rating?: Rating,
                public xmEntity?: XmEntity) {
    }
}
