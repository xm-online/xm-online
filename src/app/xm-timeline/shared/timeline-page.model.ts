import { Timeline } from './timeline.model';

export class TimelinePage {

    constructor(public timelines?: Timeline[],
                public next?: string,
    ) {
    }
}
