import { BaseSpec } from './../../shared';

export class LinkSpec implements BaseSpec {
    constructor(public key?: string,
                public name?: any,
                public backName?: any,
                public builderType?: string,
                public typeKey?: string,
                public icon?: string,
                public max?: number) {
    }
}
