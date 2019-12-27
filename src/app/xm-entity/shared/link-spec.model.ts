import { EntityLinkUiConfig } from '../../shared/spec/xm-ui-config-model';
import { BaseSpec } from './../../shared';

export interface LinkSpec extends BaseSpec {
    key?: string;
    name?: any;
    backName?: any;
    builderType?: string;
    typeKey?: string;
    icon?: string;
    max?: number;
}

export interface FullLinkSpec {
    model: LinkSpec;
    interface: EntityLinkUiConfig;
}
