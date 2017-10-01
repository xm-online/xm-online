import { Rating } from '../rating';
import { XmEntity } from '../xm-entity';
export class Vote {
    constructor(
        public id?: number,
        public userKey?: string,
        public value?: number,
        public message?: string,
        public entryDate?: any,
        public rating?: Rating,
        public xmEntity?: XmEntity,
    ) {
    }
}
