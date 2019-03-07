import { Component, OnInit } from '@angular/core';
import { Feed } from './feed.model';
import { FeedService } from './feed.service';

@Component({
    selector: 'xm-news-widget',
    templateUrl: './news-widget.component.html',
    styleUrls: ['./news-widget.component.scss']
})
export class NewsWidgetComponent implements OnInit {

    feed: Feed;
    name: string;
    url: string;
    size: number;
    config: any;
    stats: any[];

    constructor(private feedService: FeedService) {
    }

    ngOnInit() {
        this.name = this.config.name;
        this.url = this.config.url;
        this.size = this.config.size;
        this.feedService.getFeedContent(this.url).subscribe((feed) => {
            this.feed = feed;
        }, (err) => {
            console.log(err);
        });
    }

}
