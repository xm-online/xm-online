import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';

import { TwitterTimelineService } from './twitter-timeline.service';

@Component({
    selector: 'xm-twitter-timeline-widget',
    templateUrl: './twitter-timeline-widget.component.html',
    styleUrls: ['./twitter-timeline-widget.component.scss']
})
export class TwitterTimelineWidgetComponent implements OnInit, AfterViewInit {

    @Input() dataSrc: object;
    @Input() opts: object;

    config: any;

    constructor(private element: ElementRef,
                private twitterTimelineService: TwitterTimelineService
    ) {
    }

    ngOnInit() {
        this.dataSrc = this.config.dataSrc;
        this.opts = this.config.opts;
    }

    ngAfterViewInit() {
        this.twitterTimelineService.loadScript().subscribe(
            twitter => {
                const nativeElement = this.element.nativeElement;

                window['twttr'].widgets.createTimeline(this.dataSrc, nativeElement, this.opts).then(
                    function success() {
                    }
                ).catch(
                    function creationError(message) {
                        console.log('Could not create widget: ', message);
                    }
                );
            },
            err => {
                console.log('Could not load twitter widget ', err);
            },
            () => {
            }
        );
    }

}
