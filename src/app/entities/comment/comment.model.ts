import { XmEntity } from '../xm-entity';
export class Comment {
    constructor(
        public id?: number,
        public typeKey?: string,
        public message?: string,
        public entryDate?: any,
        public comment?: Comment,
        public replies?: Comment,
        public userKey?: string,
        public xmEntity?: XmEntity,
        public user?: any
    ) {
    }
}
