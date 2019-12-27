import { BaseSpec } from './../../shared';

export class Spec implements BaseSpec {
    constructor(public key?: string,
                public measures?: MeasureSpec[],
                public types?: BalanceSpec[]) {
    }
}

interface MeasureSpec extends BaseSpec {
    key?: string;
    name?: any;
    isInteger?: boolean;
}

interface BalanceSpec extends BaseSpec {
    key?: string;
    name?: any;
    measureKey?: string;
    isAlwaysShow?: boolean;
    isWithPockets?: boolean;
    entityTypeKey?: string[];
}
