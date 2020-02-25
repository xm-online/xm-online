import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { DEBUG_INFO_ENABLED, XM_EVENT_LIST } from '../../xm.constants';

import { TagSpec } from '../shared/tag-spec.model';
import { Tag } from '../shared/tag.model';
import { TagService } from '../shared/tag.service';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';

@Component({
    selector: 'xm-tag-list-section',
    templateUrl: './tag-list-section.component.html',
    styleUrls: ['./tag-list-section.component.scss'],
})
export class TagListSectionComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public xmEntityId: number;
    @Input() public tagSpecs: TagSpec[];
    public xmEntity: XmEntity;
    public tags: Tag[];
    private eventSubscriber: Subscription;

    constructor(private eventManager: JhiEventManager,
                private tagService: TagService,
                private xmEntityService: XmEntityService,
                private toasterService: XmToasterService) {
    }

    public ngOnInit(): void {
        this.eventSubscriber = this.eventManager
            .subscribe(XM_EVENT_LIST.XM_ENTITY_DETAIL_MODIFICATION, () => this.load());
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.eventSubscriber);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.xmEntityId && changes.xmEntityId.previousValue !== changes.xmEntityId.currentValue) {
            this.load();
        }
    }

    public onAdd(xmTag: Tag): void {
        const tag: Tag = {
            typeKey: 'DEFAULT',
            name: xmTag.name.toUpperCase(),
            startDate: new Date().toJSON(),
            xmEntity: this.xmEntity,
        };
        this.tagService.create(tag).subscribe(
            () => this.load(),
            () => {
                this.toasterService.error('xm-entity.tag-list-section.add-error');
                this.load();
            });
    }

    public onRemove(xmTag: Tag): void {
        this.tagService.delete(xmTag.id).subscribe(
            () => this.load(),
            () => {
                this.toasterService.error('xm-entity.tag-list-section.remove-error');
                this.load();
            });
    }

    private load(): void {
        if (!this.tagSpecs || !this.tagSpecs.length) {
            if (DEBUG_INFO_ENABLED) {
                console.info('DBG: no spec no call');
            }
            return;
        }
        this.xmEntityService.find(this.xmEntityId, {embed: 'tags'}).subscribe((xmEntity: HttpResponse<XmEntity>) => {
            this.xmEntity = xmEntity.body;
            if (xmEntity.body.tags) {
                this.tags = [...xmEntity.body.tags];
            }
        });
    }

}
