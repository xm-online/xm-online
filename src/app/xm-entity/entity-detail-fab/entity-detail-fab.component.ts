import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { AttachmentDetailDialogComponent } from '../attachment-detail-dialog/attachment-detail-dialog.component';
import { CommentDetailDialogComponent } from '../comment-detail-dialog/comment-detail-dialog.component';
import { EntityDetailDialogComponent } from '../entity-detail-dialog/entity-detail-dialog.component';
import { LinkDetailDialogComponent } from '../link-detail-dialog/link-detail-dialog.component';
import { LocationDetailDialogComponent } from '../location-detail-dialog/location-detail-dialog.component';
import { Spec } from '../shared/spec.model';
import { XmEntitySpec } from '../shared/xm-entity-spec.model';
import { XmEntity } from '../shared/xm-entity.model';

@Component({
    selector: 'xm-entity-detail-fab',
    templateUrl: './entity-detail-fab.component.html',
    styleUrls: ['./entity-detail-fab.component.scss']
})
export class EntityDetailFabComponent implements OnInit, OnChanges, OnDestroy {

    private eventSubscriber: Subscription;

    @Input() xmEntity: XmEntity;
    @Input() xmEntitySpec: XmEntitySpec;
    @Input() spec: Spec;

    view: any = {};

    constructor(private eventManager: JhiEventManager,
                private modalService: NgbModal) {
        this.registerChangeInXmEntities();
    }

    private registerChangeInXmEntities() {
        this.eventSubscriber = this.eventManager.subscribe('xmEntityDetailModification', (response) => this.detectViewBtns());
    }

    ngOnInit() {
        this.detectViewBtns();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.xmEntity && changes.xmEntity.previousValue !== changes.xmEntity.currentValue) {
            this.detectViewBtns();
        }
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    private detectViewBtns() {
        this.view.attachment = !!(this.xmEntitySpec.attachments);
        this.view.location = !!(this.xmEntitySpec.locations);
        this.view.link = !!(this.xmEntitySpec.links);
        this.view.comment = !!(this.xmEntitySpec.comments);
    }

    onRefresh() {
        this.eventManager.broadcast({name: 'xmEntityDetailModification', content: {entity: this.xmEntity}});
    }

    onAddAttachment() {
        return this.openDialog(AttachmentDetailDialogComponent, modalRef => {
            modalRef.componentInstance.attachmentSpecs = this.xmEntitySpec.attachments;
        });
    }

    onAddLink(linkSpec) {
        return this.openDialog(LinkDetailDialogComponent, modalRef => {
            modalRef.componentInstance.linkSpec = linkSpec;
            modalRef.componentInstance.sourceXmEntity = this.xmEntity;
            modalRef.componentInstance.spec = this.spec;
        });
    }

    onAddComment() {
        return this.openDialog(CommentDetailDialogComponent, modalRef => {
            modalRef.componentInstance.commentSpecs = this.xmEntitySpec.comments;
        });
    }

    onAddALocation() {
        return this.openDialog(LocationDetailDialogComponent, modalRef => {
            modalRef.componentInstance.locationSpecs = this.xmEntitySpec.locations;
        }, {size: 'lg', backdrop: 'static'});
    }

    onEdit() {
        return this.openDialog(EntityDetailDialogComponent, modalRef => {
            modalRef.componentInstance.xmEntity = Object.assign({}, this.xmEntity);
            modalRef.componentInstance.xmEntitySpec = this.xmEntitySpec;
        });
    }

    private openDialog(dialogClass, operation, options?) {
        const modalRef = this.modalService.open(dialogClass, options ? options : {backdrop: 'static'});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        operation(modalRef);
        return modalRef;
    }

}
