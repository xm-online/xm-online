import { BaseSpec } from './../../shared';

export class LocationSpec implements BaseSpec {
    constructor(public key?: string,
                public name?: any,
                public max?: number) {
    }
}
