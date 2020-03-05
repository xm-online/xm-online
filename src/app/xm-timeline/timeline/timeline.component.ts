import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { XmEventManager } from '@xm-ngx/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TimeAgoService, TimelineService } from '..';

import { XM_EVENT_LIST } from '../../xm.constants';
import { TimelinePage } from '../shared/timeline-page.model';

const TL_REFRESH_EVENT = XM_EVENT_LIST.XM_REFRESH_TIMELINE;

@Component({
    selector: 'xm-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public xmEntityId: number = 0;
    @Input() public limit: number;
    @Input() public params: any;
    @Input() public filter: any;
    @Input() public template: (arg?: any) => string;
    @Input() public config: any;

    // xmEntity: XmEntity;
    public timelinePage: TimelinePage;
    public showLoader: boolean;
    public currentSearch: string;
    public formFilter: any = {};

    public showTimelineHeader: boolean = true;

    private modifySubscription: Subscription;

    constructor(private eventManager: XmEventManager,
                private timelineService: TimelineService,
                private timeAgoService: TimeAgoService,
    ) {
        this.registerListModify();
    }

    public ngOnInit(): void {
        if (this.config && this.config.hideHeader) {
            this.showTimelineHeader = false;
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.xmEntityId && changes.xmEntityId.previousValue !== changes.xmEntityId.currentValue) {
            this.load();
        }
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.modifySubscription);
    }

    public onNextPage(next: any): void {
        this.showLoader = true;
        this.timelineService.search(this.getSearchBody({next})).pipe(
            finalize(() => this.showLoader = false))
            .subscribe((result) => {
                this.timelinePage.timelines = [...this.timelinePage.timelines, ...result.timelines];
                this.timelinePage.next = result.next;
            });
    }

    public timeAgo(time: any): any {
        return this.timeAgoService.transform(time);
    }

    public applyFastSearch(query: string): void {
        this.currentSearch = query;
        this.load();
    }

    private registerListModify(): void {
        this.modifySubscription = this.eventManager.subscribe(TL_REFRESH_EVENT, () => {
            this.load();
        });
    }

    private load(): void {
        this.showLoader = true;

        if (!this.xmEntityId) {
            this.showLoader = false;
            return;
        }

        this.timelineService.search(this.getSearchBody()).pipe(
            finalize(() => this.showLoader = false))
            .subscribe((result) => this.timelinePage = result);
    }

    private getSearchBody(options: any = {}): any {
        return Object.assign({
            id: this.xmEntityId,
            limit: this.limit,
            operation: this.currentSearch,
            dateFrom: this.formFilter.dateFrom ? this.formFilter.dateFrom.toJSON() : '',
            dateTo: this.formFilter.dateTo ? this.formFilter.dateTo.toJson() : '',
        }, this.params || {}, options);
    }

}
