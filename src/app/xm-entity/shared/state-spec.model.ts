import { BaseSpec } from './base-spec';

export interface StateSpec extends BaseSpec {
    key?: string;
    name?: any;
    icon?: string;
    color?: string;
    next?: NextSpec[];
}

export interface NextSpec extends BaseSpec {
    key?: string;
    stateKey?: string;
    inputSpec?: string;
    inputForm?: string;
    showResponse?: boolean;
    actionName?: any;
    name?: any;
}
