import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiDataUtils, JhiEventManager } from 'ng-jhipster';

import { Principal } from '../../shared/auth/principal.service';
import { AttachmentSpec } from '../shared/attachment-spec.model';
import { Attachment } from '../shared/attachment.model';
import { AttachmentService } from '../shared/attachment.service';
import { XmEntity } from '../shared/xm-entity.model';
import { Content } from '../shared/content.model';

declare let swal: any;

const ATTACHMENT_EVENT = 'attachmentListModification';

@Component({
    selector: 'xm-attachment-detail-dialog',
    templateUrl: './attachment-detail-dialog.component.html',
    styleUrls: ['./attachment-detail-dialog.component.scss']
})
export class AttachmentDetailDialogComponent implements OnInit {

    @Input() xmEntity: XmEntity;
    @Input() attachmentSpecs: AttachmentSpec[];

    attachment: Attachment = {};
    showLoader: boolean;
    readOnlyInputs: boolean;
    wrongFileType: string;

    constructor(private activeModal: NgbActiveModal,
                private attachmentService: AttachmentService,
                private eventManager: JhiEventManager,
                private dataUtils: JhiDataUtils,
                private translateService: TranslateService,
                public principal: Principal) {
    }

    ngOnInit() {
        this.attachment.typeKey = this.attachmentSpecs[0].key;
        this.attachment.content = {};
        this.attachment.name = this.attachmentSpecs[0].defaultFileName ? this.attachmentSpecs[0].defaultFileName : '';
        this.readOnlyInputs = this.attachmentSpecs[0].isNameReadonly ? this.attachmentSpecs[0].isNameReadonly : true;
    }

    get acceptedFileTypes() {
        const attachmentSpec = this.attachmentSpecs.filter((att: any) => att.key === this.attachment.typeKey).shift();
        return (attachmentSpec && attachmentSpec.contentTypes) ?
            attachmentSpec.contentTypes : '';
    }

    setFileData(event, nameCtrl) {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            // Content type validation
            const attachmentSpec = this.attachmentSpecs.filter((att: any) => att.key === this.attachment.typeKey).shift();
            if (attachmentSpec && attachmentSpec.contentTypes) {
                if (attachmentSpec.contentTypes.filter((type: string) => type === file.type).length <= 0) {
                    console.log('Not allowed content type ' + file.type);
                    this.wrongFileType = file.type;
                    return;
                }
            }

            this.wrongFileType = undefined;

            this.attachment.contentUrl = file.name;
            this.attachment.valueContentType = file.type;

            // Content assignment
            this.dataUtils.toBase64(file, (base64Data) => {
                this.attachment.content.value = base64Data;
            });

            // Default attachment name
            if (!this.attachmentSpecs[0].defaultFileName) {
                this.attachment.name = file.name;
                nameCtrl.classList.remove('is-empty');
            }
        }
    }

    byteSize(field, size) {
        return !field ? size + ' ' +  this.translateService.instant('xm-entity.attachment-card.volume.bytes')
            : this.dataUtils.byteSize(field);
    }

    onConfirmSave() {
        this.showLoader = true;
        this.attachment.xmEntity = {};
        this.attachment.xmEntity.id = this.xmEntity.id;
        this.attachment.xmEntity.typeKey = this.xmEntity.typeKey;
        this.attachment.startDate = new Date().toISOString();

        this.attachmentService.create(this.attachment).subscribe(() => this.onSaveSuccess(),
            // TODO: error processing
            (err) => console.log(err),
            () => this.showLoader = false);

    }

    private onSaveSuccess() {
        // TODO: use constant for the broadcast and analyse listeners
        console.log('Fire %s', ATTACHMENT_EVENT);
        this.eventManager.broadcast({name: ATTACHMENT_EVENT});
        this.activeModal.dismiss(true);
        this.alert('success');
    }

    onCancel() {
        this.activeModal.dismiss('cancel');
    }

    private alert(type) {
        swal({
            type: type,
            text: this.translateService.instant('xm-entity.attachment-detail-dialog.add.success'),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary'
        });
    }

}
