import { BaseEntity } from './../../shared';
import { Calendar } from './calendar.model';
import { XmEntity } from './xm-entity.model';

export class Event implements BaseEntity {
    constructor(public id?: number,
                public typeKey?: string,
                public repeatRuleKey?: string,
                public title?: string,
                public description?: string,
                public startDate?: any,
                public endDate?: any,
                public calendar?: Calendar,
                public assigned?: XmEntity) {
    }
}
