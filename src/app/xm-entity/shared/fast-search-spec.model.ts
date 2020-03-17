import { BaseSpec } from './base-spec';

export interface FastSearchSpec extends BaseSpec {
    key?: string;
    query?: string;
    name?: any;
}
