import { BaseSpec } from './../../shared';

export class FastSearchSpec implements BaseSpec {
    constructor(public key?: string,
                public query?: string,
                public name?: any) {
    }
}
