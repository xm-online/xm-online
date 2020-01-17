import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';

import { TwitterTimelineService } from './twitter-timeline.service';

@Component({
    selector: 'xm-twitter-timeline-widget',
    templateUrl: './twitter-timeline-widget.component.html',
    styleUrls: ['./twitter-timeline-widget.component.scss'],
})
export class TwitterTimelineWidgetComponent implements OnInit, AfterViewInit {

    @Input() public dataSrc: object;
    @Input() public opts: object;

    public config: any;

    constructor(private element: ElementRef,
                private twitterTimelineService: TwitterTimelineService,
    ) {
    }

    public ngOnInit(): void {
        this.dataSrc = this.config.dataSrc;
        this.opts = this.config.opts;
    }

    public ngAfterViewInit(): void {
        this.twitterTimelineService.loadScript().subscribe(
            () => {
                const nativeElement = this.element.nativeElement;

                (window as any).twttr.widgets.createTimeline(this.dataSrc, nativeElement, this.opts)
                    .catch((message) => console.info('Could not create widget: ', message));
            },
            (err) => console.info('Could not load twitter widget ', err),
        );
    }

}
