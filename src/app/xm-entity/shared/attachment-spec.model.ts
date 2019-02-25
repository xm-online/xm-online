import { BaseSpec } from './../../shared';

export class AttachmentSpec implements BaseSpec {
    constructor(public key?: string,
                public name?: any,
                public contentTypes?: string[],
                public max?: number,
                public size?: string,
                public defaultFileName?: string,
                public isNameReadonly?: boolean) {
    }
}
