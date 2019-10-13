import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TimeAgoService, TimelineService } from '..';

import { XM_EVENT_LIST } from '../../xm.constants';
import { TimelinePage } from '../shared/timeline-page.model';

const TL_REFRESH_EVENT = XM_EVENT_LIST.XM_REFRESH_TIMELINE;

@Component({
    selector: 'xm-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnChanges, OnDestroy {

    @Input() xmEntityId = 0;
    @Input() limit: number;
    @Input() params: any;
    @Input() filter: any;
    @Input() template: (arg?: any) => string;
    @Input() config: any;

    // xmEntity: XmEntity;
    timelinePage: TimelinePage;
    showLoader: boolean;
    currentSearch: string;
    formFilter: any = {};

    showTimelineHeader = true;

    private modifySubscription: Subscription;

    constructor(private eventManager: JhiEventManager,
                private timelineService: TimelineService,
                private timeAgoService: TimeAgoService,
    ) {
        this.registerListModify();
    }

    ngOnInit() {
        if (this.config && this.config.hideHeader) {
            this.showTimelineHeader = false;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.xmEntityId && changes.xmEntityId.previousValue !== changes.xmEntityId.currentValue) {
            this.load();
        }
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.modifySubscription);
    }

    private registerListModify() {
        this.modifySubscription = this.eventManager.subscribe(TL_REFRESH_EVENT, () => {
            console.log('Event: %s', TL_REFRESH_EVENT);
            this.load()
        });
    }

    private load() {
        this.showLoader = true;

        if (!this.xmEntityId) {
            this.showLoader = false;
            return;
        }

        this.timelineService.search(this.getSearchBody()).pipe(
            finalize(() => this.showLoader = false))
            .subscribe(result => this.timelinePage = result);
    }

    onNextPage(next) {
        this.showLoader = true;
        this.timelineService.search(this.getSearchBody({next: next})).pipe(
            finalize(() => this.showLoader = false))
            .subscribe(result => {
                this.timelinePage.timelines = [...this.timelinePage.timelines, ...result.timelines];
                this.timelinePage.next = result.next;
            });
    }

    timeAgo(time) {
        return this.timeAgoService.transform(time);
    }

    applyFastSearch(query: string) {
        this.currentSearch = query;
        this.load();
    }

    private getSearchBody(options: any = {}) {
        return Object.assign({
            id: this.xmEntityId,
            limit: this.limit,
            operation: this.currentSearch,
            dateFrom: this.formFilter.dateFrom ? this.formFilter.dateFrom.toJSON() : '',
            dateTo: this.formFilter.dateTo ? this.formFilter.dateTo.toJson() : ''
        }, this.params || {}, options)
    }

}
