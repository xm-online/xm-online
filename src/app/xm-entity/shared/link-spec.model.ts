import { BaseSpec } from './../../shared';
import {FieldOptions} from '../entity-list-card/entity-list-card-options.model';

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

export class LinkInterfaceSpec {
    public typeKey: string;
    public fields: FieldOptions[]
}

export class TargetInterfaceSpec extends LinkInterfaceSpec {}
export class SourceInterfaceSpec extends LinkInterfaceSpec {}

export class FullLinkSpec {
    model: LinkSpec;
    interface: LinkInterfaceSpec
}

