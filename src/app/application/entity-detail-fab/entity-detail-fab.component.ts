import {Component, Input, OnInit} from '@angular/core';
import {XmEntity} from "../../entities/xm-entity/xm-entity.model";
import {XmEntitySpecService} from "../../shared/spec/spec.service";
import {EventManager} from "ng-jhipster";
import {Subscription} from "rxjs/Subscription";
import {EntityAttachmentDialogComponent} from "../entity-attachment/entity-attachment-dialog.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NewEntityLinkDialogComponent} from "../entity-link/new-entity-link-dialog.component";
import {SearchEntityLinkDialogComponent} from "../entity-link/search-entity-link-dialog.component";
import {EntityLocationDialogComponent} from "../entity-location/entity-location-dialog.component";
import {EntityCommentDialogComponent} from "../entity-comment/entity-comment-dialog.component";

@Component({
    selector: 'xm-entity-detail-fab-cmp',
    templateUrl: './entity-detail-fab.component.html'
})
export class EntityDetailFabComponent implements OnInit {

    @Input() xmEntity: XmEntity;

    view: any = {};
    attachmentTypes: any;
    locationTypes: any;
    linkTypes: any;
    commentTypes: any[];
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: EventManager,
        private modalService: NgbModal,
        private xmEntitySpecService: XmEntitySpecService,
    ) {
      this.registerChangeInXmEntities();
    }

    ngOnInit() {
      this.detectViewBtns();
    }

    ngOnDestroy() {
      this.eventManager.destroy(this.eventSubscriber);
    }

    private registerChangeInXmEntities() {
      this.eventSubscriber = this.eventManager.subscribe('xmEntityDetailModification', (response) => this.detectViewBtns());
    }

    onAddAttachment () {
        return this.openDialog(EntityAttachmentDialogComponent, modalRef => {
            modalRef.componentInstance.attachmentTypes = Object.keys(this.attachmentTypes).map(key => this.attachmentTypes[key]);
        });
    }

    onAddLink (linkType) {
      if (linkType.builderType == "NEW") {
        return this.openDialog(NewEntityLinkDialogComponent, modalRef => {
          modalRef.componentInstance.linkType = linkType;
        }, {size: 'lg'});
      } else if (linkType.builderType == "SEARCH") {
        return this.openDialog(SearchEntityLinkDialogComponent, modalRef => {
          modalRef.componentInstance.linkType = linkType;
        }, {size: 'lg'});
      }
    }

    onAddComment () {
      return this.openDialog(EntityCommentDialogComponent, modalRef => {
        modalRef.componentInstance.commentTypes = Object.keys(this.commentTypes).map(key => this.commentTypes[key]);
      });
    }

    onAddALocation () {
      return this.openDialog(EntityLocationDialogComponent, modalRef => {
        modalRef.componentInstance.locationTypes = Object.keys(this.locationTypes).map(key => this.locationTypes[key]);
      });
    }

    private detectViewBtns () {
        const typeKey = this.xmEntity.typeKey;
        this.view.attachment = !!(this.attachmentTypes = this.xmEntitySpecService.getAttachments(typeKey));
        this.view.location = !!(this.locationTypes = this.xmEntitySpecService.getLocations(typeKey));
        this.view.link = !!(this.linkTypes = this.typesSpecToArray(this.xmEntitySpecService.getLinkTypes(typeKey)));
        this.view.comment = !!(this.commentTypes = this.typesSpecToArray(this.xmEntitySpecService.getCommentTypes(typeKey)));
    }

    private typesSpecToArray(types) {
        return types ? Object.keys(types).map(key => types[key]) : null;
    }

    private openDialog(dialogClass, operation, options?) {
        const modalRef = this.modalService.open(dialogClass, options ? options : {});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        operation(modalRef);
        return modalRef;
    }

}
