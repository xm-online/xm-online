import { BaseSpec } from './../../shared';

export class EventSpec implements BaseSpec {
    constructor(public key?: string,
                public name?: any,
                public color?: string) {
    }
}
