import { BaseSpec } from './base-spec';

export interface FunctionSpec extends BaseSpec {
    key?: string;
    name?: any;
    actionName?: any;
    allowedStateKeys?: string[];
    withEntityId?: boolean;
    inputSpec?: string;
    inputForm?: string;
    contextDataSpec?: string;
    contextDataForm?: string;
    showResponse?: boolean;
    saveFunctionContext?: boolean;
}
