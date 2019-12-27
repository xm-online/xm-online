import { BaseSpec } from './../../shared';

export interface RatingSpec extends BaseSpec {
    key?: string;
    name?: any;
    style?: string;
    votes?: number;
}
