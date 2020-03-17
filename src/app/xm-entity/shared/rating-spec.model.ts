import { BaseSpec } from './base-spec';

export interface RatingSpec extends BaseSpec {
    key?: string;
    name?: any;
    style?: string;
    votes?: number;
}
