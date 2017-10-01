import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {XmEntity} from "../../entities/xm-entity/xm-entity.model";
import {Attachment} from "../../entities/attachment/attachment.model";
import {EntityAttachmentDialogComponent} from "./entity-attachment-dialog.component";
import {EntityAttachmentDeleteDialogComponent} from "./entity-attachment-delete-dialog.component";
import {XmEntitySpecService} from "../../shared/spec/spec.service";
import {XmEntityService} from "../../entities/xm-entity/xm-entity.service";
import {AttachmentService} from "../../entities/attachment/attachment.service";
import {EventManager, JhiLanguageService} from "ng-jhipster";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'xm-attachment-cmp',
    templateUrl: './entity-attachment.component.html',
})
export class EntityAttachmentComponent implements OnInit {

    @Input() xmEntityId: number;

    xmEntity: XmEntity;
    attachmentTypes: any;
    attachments: Attachment[];
    private modifySubscription: Subscription;

    constructor(
        private eventManager: EventManager,
        private modalService: NgbModal,
        private xmEntitySpecService: XmEntitySpecService,
        private xmEntityService: XmEntityService,
        private attachmentService: AttachmentService,
        private jhiLanguageService: JhiLanguageService
    ) {
        this.registerListModify();
        this.jhiLanguageService.addLocation('attachment');
        this.jhiLanguageService.addLocation('xmEntity');
    }

    ngOnInit() {
        this.load()
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.modifySubscription);
    }

    private registerListModify() {
        this.modifySubscription = this.eventManager.subscribe('attachmentListModification', (response) => this.load());
    }

    private load() {
        this.xmEntityService.find(this.xmEntityId)
            .subscribe(xmEntity => {
                const typeKey = xmEntity.typeKey;

                this.xmEntity = xmEntity;
                this.attachmentTypes = this.xmEntitySpecService.getAttachments(typeKey);
                this.attachments = this.parseAttachmentToView(xmEntity.attachments);
            })
        ;
    }

    onRemove(attachment) {
        return this.openDialog(EntityAttachmentDeleteDialogComponent, modalRef => {
            modalRef.componentInstance.attachment = attachment;
        });
    }

    onManage(xmEntity, attachment?) {
        return this.openDialog(EntityAttachmentDialogComponent, modalRef => {
            modalRef.componentInstance.attachmentTypes = Object.keys(this.attachmentTypes).map(key => this.attachmentTypes[key]);
            if (attachment) {
                modalRef.componentInstance.attachment = Object.assign({}, attachment);
                // modalRef.componentInstance.attachment.xmEntity = xmEntity;
            }
        });
    }

    private openDialog(dialogClass, operation, options?) {
        const modalRef = this.modalService.open(dialogClass, options ? options : {});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        operation(modalRef);
        return modalRef;
    }

    private getContentType(valueContentType: string): string {
        if (valueContentType.indexOf('/') > 0) {
            return valueContentType.split('/')[0];
        }
        return valueContentType;
    }

    private getFileType(valueContentType: string): string {
        if (valueContentType.indexOf('/') > 0) {
            return valueContentType.split('/')[1];
        }
        return valueContentType;
    }

    private getFileTypeImage(valueContentType: string): string {
        let vct = this.getFileType(valueContentType);
        return `/assets/img/filetypes/filetype-${vct}.png`;
    }

    private getAttachmentTypeName(key): string {
        if (!this.attachmentTypes) {
            return;
        }

        let attachmentType = this.attachmentTypes[key];
        if (attachmentType) {
            return attachmentType.name.en;
        }
        return key;
    }

    private transformFileSize(bytes: number, precision: number):string {
        let units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

        if ( isNaN( parseFloat( String(bytes) )) || ! isFinite( bytes ) ) return '?';
        let unit = 0;
        while ( bytes >= 1024 ) {
            bytes /= 1024;
            unit ++;
        }

        if (unit == 0) precision = 0;

        return bytes.toFixed( + precision ) + ' ' + units[ unit ];
    }

    private parseAttachmentToView (list: Attachment[]=[]) {
        return list.map((el: Attachment) => {
            el.typeName = this.getAttachmentTypeName(el.typeKey);
            el.contentUrl = this.getFileTypeImage(el.valueContentType);
            el.contentType = this.getContentType(el.valueContentType);
            el.fileType = this.getFileType(el.valueContentType);
            el.contentSize = this.transformFileSize(el.valueContentSize, 2);
            this.attachmentService.find(el.id).subscribe((result: Attachment) => {
                if (result.content && result.content.value) {
                    result.content.value = `data:${result.valueContentType};base64,` + result.content.value;
                }
                el.content = result.content;
            });
            return el;
        });
    }

}
