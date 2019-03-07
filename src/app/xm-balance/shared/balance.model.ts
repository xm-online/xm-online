import { BaseEntity } from '../../shared';
import { Pocket, Metric } from '../';

export class Balance implements BaseEntity {
    constructor(
        public id?: number,
        public key?: string,
        public typeKey?: string,
        public measureKey?: string,
        public amount?: number,
        public reserved?: number,
        public entityId?: number,
        public createdBy?: string,
        public pockets?: Pocket[],
        public metrics?: Metric[],
    ) {
    }
}
