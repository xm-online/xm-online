import { BaseSpec } from './../../shared';
import {EntityLinkUiConfig} from '../../shared/spec/xm-ui-config-model';

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

export class TargetInterfaceSpec extends EntityLinkUiConfig {}
export class SourceInterfaceSpec extends EntityLinkUiConfig {}

export class FullLinkSpec {
    model: LinkSpec;
    interface: EntityLinkUiConfig
}

