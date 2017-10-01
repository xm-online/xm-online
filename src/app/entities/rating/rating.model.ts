import { XmEntity } from '../xm-entity';
import { Vote } from '../vote';
export class Rating {
    constructor(
        public id?: number,
        public typeKey?: string,
        public value?: number,
        public startDate?: any,
        public endDate?: any,
        public xmEntity?: XmEntity,
        public votes?: Vote[],
    ) {
    }
}
