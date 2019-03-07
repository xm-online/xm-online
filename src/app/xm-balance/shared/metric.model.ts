import { BaseEntity } from './../../shared';

export class Metric implements BaseEntity {
    constructor(
        public id?: number,
        public key?: string,
        public typeKey?: string,
        public value?: string,
        public balanceId?: number,
    ) {
    }
}
