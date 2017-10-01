import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Response} from '@angular/http';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {EventManager, AlertService, JhiLanguageService} from 'ng-jhipster';
import {XmEntity} from '../../entities/xm-entity';
import {Attachment} from '../../entities/attachment/attachment.model';
import {CommentService} from '../../entities/comment/comment.service';
import {Comment} from '../../entities/comment/comment.model';
import {Principal} from "app/shared";

declare let $: any;

@Component({
    selector: 'xm-comment-dialog',
    templateUrl: './entity-comment-dialog.component.html'
})
export class EntityCommentDialogComponent implements OnInit, AfterViewInit {

    comment: Comment;
    isSaving: boolean;
    xmEntity: XmEntity;
    commentType: any;
    commentTypes: any[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private commentService: CommentService,
        private principal: Principal,
    ) {
        this.jhiLanguageService.addLocation('comment');
        this.comment = new Comment();
        this.xmEntity = new XmEntity();
    }

    ngOnInit() {
        if (this.commentType) {
            this.comment.typeKey = this.commentType
        } else {
            this.comment.typeKey = this.commentTypes[0].key;
        }
        this.isSaving = false;
        if (!this.comment.entryDate) {
            this.comment.entryDate = new Date().toISOString();
        }
    }

    ngAfterViewInit() {
        //  Init Bootstrap Select Picker
        setTimeout(() => {
            let selectpickers = $('.selectpicker');
            selectpickers.length && selectpickers.selectpicker();
        }, 10);

    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save(editForm) {

        if (!editForm.valid) {
            for (const controlName in editForm.controls) {
                const control = editForm.controls[controlName];
                if (control.valid) {
                    continue;
                }
                control.markAsTouched(true);
                control.markAsDirty(true);
            }
            return;
        }

        this.isSaving = true;
        this.comment.userKey= "-";
        this.comment.xmEntity = new XmEntity();
        this.comment.xmEntity.id = this.xmEntity.id;
        this.comment.xmEntity.typeKey = this.xmEntity.typeKey;
        this.commentService.create(this.comment)
            .subscribe((res: Attachment) =>
                this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));

    }

    private onSaveSuccess(result: Attachment) {
        this.eventManager.broadcast({ name: 'commentListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

}

