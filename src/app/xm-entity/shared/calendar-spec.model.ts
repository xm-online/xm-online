import { BaseSpec } from './../../shared';
import { EventSpec } from './event-spec.model';

export class CalendarSpec implements BaseSpec {
    constructor(public key?: string,
                public name?: any,
                public events?: EventSpec[]) {
    }
}
