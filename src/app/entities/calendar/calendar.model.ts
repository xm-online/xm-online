import { XmEntity } from '../xm-entity';
import { Event } from '../event';
export class Calendar {
    constructor(
        public id?: number,
        public typeKey?: string,
        public name?: string,
        public description?: string,
        public startDate?: any,
        public endDate?: any,
        public xmEntity?: XmEntity,
        public events?: Event[],
    ) {
    }
}
