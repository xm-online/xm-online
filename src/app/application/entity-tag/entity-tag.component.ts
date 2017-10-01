import {Component, Input, OnInit} from '@angular/core';
import {TagService} from "../../entities/tag/tag.service";
import {XmEntity} from "../../entities/xm-entity/xm-entity.model";
import {EventManager} from "ng-jhipster";
import {Tag} from "../../entities/tag/tag.model";
import {XmEntitySpecService} from "../../shared/spec/spec.service";
import {XmEntityService} from "app/entities/xm-entity";
import {Subscription} from "rxjs";
import {Observable} from "rxjs/Observable";

declare let $: any;

@Component({
    selector: 'xm-tag-cmp',
    template: `<div *ngIf="isTagsAvailable">
      <tag-input [(ngModel)]='tags' placeholder="type tag..."
                 (onAdd)="onAdd($event)"
                 (onRemove)="onRemove($event)"
                 [displayBy]="'name'"
                 [identifyBy]="'id'"
                 theme="filled-theme"
      ></tag-input>
    </div>`
})
export class EntityTagComponent implements OnInit {

    @Input() xmEntityId: number;

    xmEntity: XmEntity;
    tags: Tag[];
    isTagsAvailable: boolean;
    private type: any;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: EventManager,
        private xmTagService: TagService,
        private xmEntityService: XmEntityService,
        private xmEntitySpecService: XmEntitySpecService,
    ) {
        this.registerListModify();
    }

    ngOnInit() {
        this.load();
    }

    private registerListModify() {
        this.eventSubscriber = this.eventManager.subscribe('xmEntityDetailModification', (response) => this.load());
    }

    private load() {
        this.xmEntityService.find(this.xmEntityId)
            .subscribe(xmEntity => {
                const typeKey = xmEntity.typeKey;
                this.xmEntity = xmEntity;
                this.tags = [...xmEntity.tags];
                this.type = this.xmEntitySpecService.getType(typeKey) || {};
                this.isTagsAvailable = !!this.type.tags;
            })
        ;
    }

    onAdd(xmTag: Tag) {
        let tag: Tag = new Tag(undefined, 'DEFAULT', xmTag.name.toUpperCase(), new Date().toJSON(), this.xmEntity);
        this.xmTagService.create(tag).subscribe(
            (res: Tag) => this.load(),
            (res: Response) => console.log('ERROR: TAG not added.')
        );
    }

    onRemove(xmTag: Tag) {
        this.xmTagService.delete(xmTag.id).subscribe(
            (res: Tag) => this.load(),
            (res: Response) => console.log('ERROR: TAG not removed.')
        );
    }
}
