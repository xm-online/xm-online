import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { Principal } from '../../shared/auth/principal.service';
import { CommentSpec } from '../shared/comment-spec.model';
import { Comment } from '../shared/comment.model';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';

@Component({
    selector: 'xm-comment-list',
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit, OnChanges, OnDestroy {

    private modificationSubscription: Subscription;

    @Input() xmEntityId: number;
    @Input() commentSpecs: CommentSpec[];

    xmEntity: XmEntity;
    comments: Comment[] = [];

    constructor(private xmEntityService: XmEntityService,
                private eventManager: JhiEventManager,
                public principal: Principal) {
    }

    ngOnInit() {
        this.registerListModify();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.xmEntityId && changes.xmEntityId.previousValue !== changes.xmEntityId.currentValue) {
            this.load();
        }
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.modificationSubscription);
    }

    private registerListModify() {
        this.modificationSubscription = this.eventManager.subscribe('commentListModification', (response) => this.load());
    }

    private load() {
        this.xmEntityService.find(this.xmEntityId, {'embed': 'comments'}).subscribe((xmEntity: HttpResponse<XmEntity>) => {
            this.xmEntity = xmEntity.body;
            if (xmEntity.body.comments) {
                this.comments = [...xmEntity.body.comments];
            }
        });
    }

}
