import { XmEntity } from '../xm-entity';
export class Location {
    constructor(
        public id?: number,
        public typeKey?: string,
        public longitude?: number,
        public latitude?: number,
        public name?: string,
        public addressLine1?: string,
        public addressLins2?: string,
        public city?: string,
        public region?: string,
        public zip?: string,
        public xmEntity?: XmEntity,
        public country?: string,
        public isView?: boolean
    ) {
    }
}
