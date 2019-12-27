import { FeedEntry } from './feed-entry.model';
import { FeedInfo } from './feed-info.model';

export interface Feed {
    status: string;
    feed: FeedInfo;
    items: FeedEntry[];
}
