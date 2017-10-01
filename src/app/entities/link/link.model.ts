import { XmEntity } from '../xm-entity';
export class Link {
    constructor(
        public id?: number,
        public typeKey?: string,
        public name?: string,
        public description?: string,
        public startDate?: any,
        public endDate?: any,
        public source?: XmEntity,
        public target?: XmEntity,
    ) {
    }
}
