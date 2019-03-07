import { BaseSpec } from './../../shared';

export class StateSpec implements BaseSpec {
    constructor(public key?: string,
                public name?: any,
                public icon?: string,
                public color?: string,
                public next?: NextSpec[]) {
    }
}

export class NextSpec implements BaseSpec {
    constructor(public key?: string,
                public stateKey?: string,
                public inputSpec?: string,
                public inputForm?: string,
                public showResponse?: boolean,
                public actionName?: any,
                public name?: any) {
    }
}
