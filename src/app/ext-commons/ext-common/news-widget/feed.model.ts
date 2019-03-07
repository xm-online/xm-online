import {FeedInfo} from './feed-info.model';
import {FeedEntry} from './feed-entry.model';

export interface Feed {
    status: string,
    feed: FeedInfo,
    items: Array<FeedEntry>
}
