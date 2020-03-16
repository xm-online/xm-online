import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog/typings/dialog-ref';

import { TranslateService } from '@ngx-translate/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmEventManager } from '@xm-ngx/core';
import { XmToasterService } from '@xm-ngx/toaster';
import { Subscription } from 'rxjs';
import { Principal } from '@xm-ngx/core/auth';
import { saveFile, saveFileFromUrl } from '../../shared/helpers/file-download-helper';
import { EntityUiConfig } from '../../shared/spec/xm-ui-config-model';
import { DEBUG_INFO_ENABLED, XM_EVENT_LIST } from '../../xm.constants';
import { AttachmentDetailDialogComponent } from '../attachment-detail-dialog/attachment-detail-dialog.component';
import { AttachmentSpec } from '../shared/attachment-spec.model';
import { Attachment } from '../shared/attachment.model';
import { AttachmentService } from '../shared/attachment.service';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';


const ATTACHMENT_EVENT = XM_EVENT_LIST.XM_ATTACHMENT_LIST_MODIFICATION;

@Component({
    selector: 'xm-attachment-list-base',
    template: `no template, to be extended`,
})
export class AttachmentListBaseComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public xmEntityId: number;
    @Input() public attachmentSpecs: AttachmentSpec[];
    @Input() public xmEntity: XmEntity;
    public attachments: Attachment[];
    @Input() public entityUiConfig: EntityUiConfig;
    private modificationSubscription: Subscription;

    constructor(protected attachmentService: AttachmentService,
                protected xmEntityService: XmEntityService,
                protected eventManager: XmEventManager,
                protected toasterService: XmToasterService,
                protected alertService: XmAlertService,
                protected translateService: TranslateService,
                protected principal: Principal,
                protected modalService: MatDialog) {
    }

    public ngOnInit(): void {
        this.registerListModify();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.xmEntityId && changes.xmEntityId.previousValue !== changes.xmEntityId.currentValue) {
            this.load();
        }
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.modificationSubscription);
    }

    public onRefresh(): void {
        this.load();
    }

    public xmAttachmentContext(): () => any {
        return () => (this.attachmentSpecs && this.attachmentSpecs.length);
    }

    public onAddAttachment(): void {
        this.openDialog(AttachmentDetailDialogComponent, (modalRef) => {
            modalRef.componentInstance.attachmentSpecs = this.attachmentSpecs;
        });
    }

    public getAttachmentSpec(attachment: Attachment): AttachmentSpec {
        return this.attachmentSpecs.filter((ls) => ls.key === attachment.typeKey).shift();
    }

    public getFileSize(attachment: Attachment, precision: number): string {
        const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        let bytes = attachment.valueContentSize ? attachment.valueContentSize : 0;

        if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) {
            return '?';
        }
        let unit = 0;
        while (bytes >= 1024) {
            bytes /= 1024;
            unit++;
        }
        return bytes.toFixed(+(unit === 0 ? 0 : precision)) + ' '
            + (this.translateService.instant('xm-entity.attachment-card.volume.' + units[unit]));
    }

    public onRemove(attachment: Attachment): void {
        this.alertService.open({
            title: 'xm-entity.attachment-card.delete.title',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'xm-entity.attachment-card.delete.button',
        }).subscribe((result) => {
            if (result.value) {
                this.attachmentService.delete(attachment.id).subscribe(
                    () => {
                        this.eventManager.broadcast({
                            name: 'attachmentListModification',
                        });
                        this.toasterService.success( 'xm-entity.attachment-card.delete.remove-success');
                    },
                    () => this.toasterService.error( 'xm-entity.attachment-card.delete.remove-error'),
                );
            }
        });
    }

    public onDownload(attachment: Attachment): void {
        if (attachment.contentUrl && !attachment.contentChecksum) {
            saveFileFromUrl(attachment.contentUrl, attachment.name);
        } else {
            if (attachment.body && attachment.body.content && attachment.body.content.value) {
                this.saveInnerAttachment(attachment.body);
            } else {
                this.attachmentService.find(attachment.id).subscribe(
                    (attachmentResp: HttpResponse<Attachment>) => this.saveInnerAttachment(attachmentResp.body));
            }
        }
    }

    private openDialog(dialogClass: any, operation: any, options?: any): MatDialogRef<any> {
        const modalRef = this.modalService.open<any>(dialogClass, options ? options : {width: '500px'});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        operation(modalRef);
        return modalRef;
    }

    private load(): void {
        this.attachments = [];

        if (!this.attachmentSpecs || !this.attachmentSpecs.length) {
            if (DEBUG_INFO_ENABLED) {
                console.info('DBG: no spec no call');
            }
            return;
        }

        if (this.xmEntity && this.xmEntity.attachments) {
            if (DEBUG_INFO_ENABLED) {
                console.info('DBG: use existing data');
            }
            this.attachments = [...this.xmEntity.attachments];
            return;
        }

        this.xmEntityService.find(this.xmEntityId, {embed: 'attachments'})
            .subscribe((xmEntity: HttpResponse<XmEntity>) => {
                if (xmEntity.body.attachments) {
                    this.attachments = [...xmEntity.body.attachments];
                }
            });
    }

    private registerListModify(): void {
        this.modificationSubscription = this.eventManager.subscribe(ATTACHMENT_EVENT, (response) => {
            if (DEBUG_INFO_ENABLED) {
                console.info(`DBG: $%o`, response);
            }
            this.load();
        });
    }

    private saveInnerAttachment(body: any): void {
        const byteString = atob(body.content.value);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], {type: body.valueContentType});
        const filename = body.contentUrl;
        saveFile(blob, filename, body.valueContentType);
    }

}
