import { BaseEntity } from './../../shared';
import { XmEntity } from './xm-entity.model';

export class Location implements BaseEntity {
    constructor(public id?: number,
                public typeKey?: string,
                public countryKey?: string,
                public longitude?: number,
                public latitude?: number,
                public name?: string,
                public addressLine1?: string,
                public addressLine2?: string,
                public city?: string,
                public region?: string,
                public zip?: string,
                public xmEntity?: XmEntity) {
    }
}
