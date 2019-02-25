import { BaseSpec } from './../../shared';

export class Spec implements BaseSpec {
    constructor(public key?: string,
                public measures?: MeasureSpec[],
                public types?: BalanceSpec[]) {
    }
}

class MeasureSpec implements BaseSpec {
    constructor(public key?: string,
                public name?: any,
                public isInteger?: boolean) {
    }
}

class BalanceSpec implements BaseSpec {
    constructor(public key?: string,
                public name?: any,
                public measureKey?: string,
                public isAlwaysShow?: boolean,
                public isWithPockets?: boolean,
                public entityTypeKey?: string[]) {
    }
}
