import { BaseSpec } from './../../shared';
import { EventSpec } from './event-spec.model';

export interface CalendarSpec extends BaseSpec {
    key?: string;
    name?: any;
    events?: EventSpec[];
}
