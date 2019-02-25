import { BaseEntity } from './../../shared';

export class Pocket implements BaseEntity {
    constructor(
        public id?: number,
        public key?: string,
        public label?: string,
        public startDateTime?: any,
        public endDateTime?: any,
        public amount?: number,
        public reserved?: number,
        public balanceId?: number,
    ) {
    }
}
