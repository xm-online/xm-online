import { BaseSpec } from './../../shared';

export interface AttachmentSpec extends BaseSpec {
    key?: string;
    name?: any;
    contentTypes?: string[];
    max?: number;
    size?: string;
    defaultFileName?: string;
    isNameReadonly?: boolean;
}
