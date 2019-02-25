import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { AttachmentSpec } from '../shared/attachment-spec.model';
import { Attachment } from '../shared/attachment.model';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';

const ATTACHMENT_EVENT = 'attachmentListModification';

@Component({
    selector: 'xm-attachment-list',
    templateUrl: './attachment-list.component.html',
    styleUrls: ['./attachment-list.component.scss']
})
export class AttachmentListComponent implements OnInit, OnChanges, OnDestroy {

    private modificationSubscription: Subscription;

    @Input() xmEntityId: number;
    @Input() attachmentSpecs: AttachmentSpec[];

    xmEntity: XmEntity;
    attachments: Attachment[];

    constructor(private xmEntityService: XmEntityService,
                private eventManager: JhiEventManager) {
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
        this.modificationSubscription = this.eventManager.subscribe(ATTACHMENT_EVENT, (response) => {
            console.log(response)
            this.load()
        });
    }

    private load() {
        this.attachments = [];
        this.xmEntityService.find(this.xmEntityId, {'embed': 'attachments'}).subscribe((xmEntity: HttpResponse<XmEntity>) => {
            this.xmEntity = xmEntity.body;
            if (xmEntity.body.attachments) {
                this.attachments = [...xmEntity.body.attachments];
            }
        });
    }

    getAttachmentSpec(attachment: Attachment) {
        return this.attachmentSpecs.filter((ls) => ls.key === attachment.typeKey).shift();
    }

}
