import { Component} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import {Attachment} from "../../entities/attachment/attachment.model";
import {AttachmentService} from "../../entities/attachment/attachment.service";

@Component({
    selector: 'xm-attachment-delete-dialog',
    templateUrl: './entity-attachment-delete-dialog.component.html'
})
export class EntityAttachmentDeleteDialogComponent {

    attachment: Attachment;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private attachmentService: AttachmentService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.addLocation('attachment');
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.attachmentService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'attachmentListModification',
                content: 'Deleted an attachment'
            });
            this.activeModal.dismiss(true);
        });
    }
}
