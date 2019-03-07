import { BaseSpec } from './../../shared';

export class FunctionSpec implements BaseSpec {
    constructor(public key?: string,
                public name?: any,
                public actionName?: any,
                public allowedStateKeys?: string[],
                public withEntityId?: boolean,
                public inputSpec?: string,
                public inputForm?: string,
                public contextDataSpec?: string,
                public contextDataForm?: string,
                public showResponse?: boolean,
                public saveFunctionContext?: boolean) {
    }
}
