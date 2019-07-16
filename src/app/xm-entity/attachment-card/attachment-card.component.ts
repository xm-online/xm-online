import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';

import { Principal } from '../../shared/auth/principal.service';
import { saveFile, saveFileFromUrl } from '../../shared/helpers/file-download-helper';
import { AttachmentSpec } from '../shared/attachment-spec.model';
import { Attachment } from '../shared/attachment.model';
import { AttachmentService } from '../shared/attachment.service';

declare let swal: any;

@Component({
    selector: 'xm-attachment-card',
    templateUrl: './attachment-card.component.html',
    styleUrls: ['./attachment-card.component.scss']
})
export class AttachmentCardComponent implements OnInit {

    private availableFileTypeImages = ['3gp', 'av', 'divx', 'eps', 'html', 'js', 'php', 'rar', 'txt', '7z', 'bak', 'dll',
        'exe', 'ico', 'mov', 'png', 'svg', 'wav', 'ae', 'bmp', 'doc', 'flv', 'iso', 'mp3', 'ppt', 'swf', 'zip', 'ai', 'cdr',
        'docx', 'fw', 'jar', 'mp4', 'pptx', 'sys', 'apk', 'css', 'dw', 'gif', 'jpeg', 'mpeg', 'ps', 'tar', 'asf', 'csv',
        'dwg', 'gz', 'jpg', 'pdf', 'psd', 'tiff'];

    @Input() attachment: Attachment;
    @Input() attachmentSpec: AttachmentSpec;

    imageSrc: string;

    constructor(private attachmentService: AttachmentService,
                private eventManager: JhiEventManager,
                private translateService: TranslateService,
                public principal: Principal) {
    }

    ngOnInit() {
        if (this.isImage()) {
            this.loadImage();
        }
    }

    isImage(): boolean {
        return this.attachment.hasOwnProperty('valueContentType') && this.attachment.valueContentType.startsWith('image');
    }

    loadImage() {
        this.attachmentService.find(this.attachment.id).subscribe((attachmentResp: HttpResponse<Attachment>) => {
            if (attachmentResp.body.content && attachmentResp.body.content.value) {
                this.attachment.body = attachmentResp.body;
                this.imageSrc = `data:${attachmentResp.body.valueContentType};base64,` + attachmentResp.body.content.value;
            }
        });
    }

    getFileTypeImage(): string {
        let vct: string;
        if (this.attachment.contentUrl) {
            vct = this.attachment.contentUrl.split('.').pop()
        } else {
            vct = this.attachment.valueContentType.indexOf('/') > 0 ? this.attachment.valueContentType.split('/').pop()
                : this.attachment.valueContentType;
        }
        return this.availableFileTypeImages.includes(vct) ? `/assets/img/filetypes/filetype-${vct}.png` : null;
    }

    getFileSize(precision: number): string {
        const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        let bytes = this.attachment.valueContentSize;

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

    onDownload() {
        if (this.attachment.contentUrl && !this.attachment.contentChecksum) {
            saveFileFromUrl(this.attachment.contentUrl, this.attachment.name);
        } else {
            if (this.attachment.body && this.attachment.body.content &&  this.attachment.body.content.value) {
                this.saveInnerAttachment(this.attachment.body);
            } else {
                this.attachmentService.find(this.attachment.id).subscribe(
                    (attachmentResp: HttpResponse<Attachment>) => this.saveInnerAttachment(attachmentResp.body));
            }
        }
    }

    private saveInnerAttachment(body) {
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

    onRemove() {
        swal({
            title: this.translateService.instant('xm-entity.attachment-card.delete.title'),
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-raised-button btn-primary',
            cancelButtonClass: 'btn mat-raised-button',
            confirmButtonText: this.translateService.instant('xm-entity.attachment-card.delete.button')
        }).then((result) => {
            if (result.value) {
                this.attachmentService.delete(this.attachment.id).subscribe(
                    () => {
                        this.eventManager.broadcast({
                            name: 'attachmentListModification'
                        });
                        this.alert('success', 'xm-entity.attachment-card.delete.remove-success');
                    },
                    () => this.alert('error', 'xm-entity.attachment-card.delete.remove-error')
                );
            }
        });
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
