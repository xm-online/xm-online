import {Component, Input, OnInit} from '@angular/core';
import {XmEntity} from "../../entities/xm-entity/xm-entity.model";
import {Subscription} from "rxjs/Subscription";
import {EventManager, JhiLanguageService} from "ng-jhipster";
import {XmEntityService} from "../../entities/xm-entity/xm-entity.service";
import {TimelineService} from "../../entities/timeline/timeline.service";
import {TimeAgoService} from "../../entities/timeline/timeAgo.service";
import {TimelinePage} from "../../entities/timeline/timeline-page.model";

@Component({
    selector: 'xm-timeline-cmp',
    templateUrl: './entity-timeline.component.html'
})
export class EntityTimelineComponent implements OnInit {

    @Input() xmEntityId: number;

    xmEntity: XmEntity;
    timelinePage: TimelinePage;
    private modifySubscription: Subscription;

    constructor(
        private eventManager: EventManager,
        private xmEntityService: XmEntityService,
        private timelineService: TimelineService,
        private timeAgoService: TimeAgoService,
        private jhiLanguageService: JhiLanguageService
    ) {
        this.registerListModify();
        this.jhiLanguageService.addLocation('xmEntity');
    }

    ngOnInit() {
        this.load()
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.modifySubscription);
    }

    private registerListModify() {
        this.modifySubscription = this.eventManager.subscribe('xmEntityDetailModification', (response) => this.load());
    }

    private load() {
        this.xmEntityService.find(this.xmEntityId)
            .subscribe(xmEntity => {
                this.xmEntity = xmEntity;
                this.timelineService.search(xmEntity.id).subscribe(result => this.timelinePage = result);
            })
        ;
    }

    onNextPage(entityId, next) {
        this.timelineService.searchNext(entityId, next).subscribe(result => {
            this.timelinePage.timelines = [...this.timelinePage.timelines, ...result.timelines];
            this.timelinePage.next = result.next;
        });
    }

    timeAgo(time) {
        return this.timeAgoService.transform(time);
    }

}
