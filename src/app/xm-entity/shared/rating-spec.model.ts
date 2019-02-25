import { BaseSpec } from './../../shared';

export class RatingSpec implements BaseSpec {
    constructor(public key?: string,
                public name?: any,
                public style?: string,
                public votes?: number) {
    }
}
