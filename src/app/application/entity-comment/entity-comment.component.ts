import {Component, Input, OnInit} from '@angular/core';
import {XmEntity} from "../../entities/xm-entity/xm-entity.model";
import {Subscription} from "rxjs/Subscription";
import {EventManager} from "ng-jhipster";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {XmEntitySpecService} from "../../shared/spec/spec.service";
import {XmEntityService} from "../../entities/xm-entity/xm-entity.service";
import {EntityCommentDialogComponent} from "./entity-comment-dialog.component";

@Component({
    selector: 'xm-comment-cmp',
    templateUrl: './entity-comment.component.html'
})
export class EntityCommentComponent implements OnInit {

    @Input() xmEntityId: number;

    xmEntity: XmEntity;
    commentTypes: any;
    private modifySubscription: Subscription;

    constructor(
        private eventManager: EventManager,
        private modalService: NgbModal,
        private xmEntitySpecService: XmEntitySpecService,
        private xmEntityService: XmEntityService,
    ) {
        this.registerListModify();
    }

    ngOnInit() {
        this.load()
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.modifySubscription);
    }

    private registerListModify() {
        this.modifySubscription = this.eventManager.subscribe('commentListModification', (response) => this.load());
    }

    private load() {
        this.xmEntityService.find(this.xmEntityId)
            .subscribe(xmEntity => {
                const typeKey = xmEntity.typeKey;

                this.xmEntity = xmEntity;
                this.commentTypes = this.typesSpecToArray(this.xmEntitySpecService.getCommentTypes(typeKey));
            })
        ;
    }

    onManage(commentType) {
        return this.openDialog(EntityCommentDialogComponent, modalRef => {
            modalRef.componentInstance.commentType = commentType.key;
            // modalRef.componentInstance.xmEntity = this.xmEntity;
        });
    }

    private openDialog(dialogClass, operation, options?) {
        const modalRef = this.modalService.open(dialogClass, options ? options : {});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        operation(modalRef);
        return modalRef;
    }

    private typesSpecToArray(types) {
        return types ? Object.keys(types).map(key => types[key]) : [];
    }

}
