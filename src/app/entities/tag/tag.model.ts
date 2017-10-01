import { XmEntity } from '../xm-entity';
export class Tag {
    constructor(
        public id?: number,
        public typeKey?: string,
        public name?: string,
        public startDate?: any,
        public xmEntity?: XmEntity,
    ) {
    }
}
