import { Calendar } from '../calendar';
import { XmEntity } from '../xm-entity';
export class Event {
    constructor(
        public id?: number,
        public typeKey?: string,
        public repeatRuleKey?: string,
        public title?: string,
        public description?: string,
        public startDate?: any,
        public endDate?: any,
        public calendar?: Calendar,
        public assigned?: XmEntity,
    ) {
    }
}
