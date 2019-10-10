import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';

import { Principal } from '../../shared/auth/principal.service';
import { CommentSpec } from '../shared/comment-spec.model';
import { Comment } from '../shared/comment.model';
import { CommentService } from '../shared/comment.service';
import { XmEntity } from '../shared/xm-entity.model';

declare let swal: any;

@Component({
    selector: 'xm-comment-detail-dialog',
    templateUrl: './comment-detail-dialog.component.html',
    styleUrls: ['./comment-detail-dialog.component.scss']
})
export class CommentDetailDialogComponent implements OnInit {

    @Input() xmEntity: XmEntity;
    @Input() commentSpecs: CommentSpec[];

    comment: Comment = {};
    showLoader: boolean;

    constructor(private activeModal: NgbActiveModal,
                private commentService: CommentService,
                private eventManager: JhiEventManager,
                private translateService: TranslateService,
                public principal: Principal) {
    }

    ngOnInit() {
        if (this.commentSpecs && this.commentSpecs.length > 0) {
            this.comment.typeKey = this.commentSpecs[0].key;
        }
    }

    onConfirmSave() {
        this.showLoader = true;
        this.comment.xmEntity = this.xmEntity;
        this.comment.entryDate = new Date().toISOString();
        this.comment.userKey = this.principal.getUserKey();
        this.commentService.create(this.comment)
            .subscribe(() => this.onSaveSuccess(),
            (err) => this.onError(err),
            () => this.showLoader = false);
    }

    private onError(e) {
        console.log(e);
        this.showLoader = false;
    }

    private onSaveSuccess() {
        // TODO: use constant for the broadcast and analyse listeners
        this.eventManager.broadcast({name: 'commentListModification'});
        this.activeModal.dismiss(true);
        this.alert('success', 'xm-entity.comment-detail-dialog.add.success');
    }

    onCancel() {
        this.activeModal.dismiss('cancel');
    }

    private alert(type, key) {
        swal({
            type: type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary'
        });
    }

}
