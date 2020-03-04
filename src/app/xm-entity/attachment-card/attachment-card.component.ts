import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiEventManager } from 'ng-jhipster';

import { saveFile, saveFileFromUrl } from '../../shared/helpers/file-download-helper';
import { AttachmentSpec } from '../shared/attachment-spec.model';
import { Attachment } from '../shared/attachment.model';
import { AttachmentService } from '../shared/attachment.service';


@Component({
    selector: 'xm-attachment-card',
    templateUrl: './attachment-card.component.html',
    styleUrls: ['./attachment-card.component.scss'],
})
export class AttachmentCardComponent implements OnInit {

    @Input() public attachment: Attachment;
    @Input() public attachmentSpec: AttachmentSpec;
    public imageSrc: string;
    private availableFileTypeImages: string[] = [
        '3gp', 'av', 'divx', 'eps', 'html', 'js', 'php', 'rar', 'txt', '7z', 'bak', 'dll',
        'exe', 'ico', 'mov', 'png', 'svg', 'wav', 'ae', 'bmp', 'doc', 'flv', 'iso', 'mp3', 'ppt', 'swf', 'zip', 'ai',
        'cdr',
        'docx', 'fw', 'jar', 'mp4', 'pptx', 'sys', 'apk', 'css', 'dw', 'gif', 'jpeg', 'mpeg', 'ps', 'tar', 'asf', 'csv',
        'dwg', 'gz', 'jpg', 'pdf', 'psd', 'tiff'];

    constructor(private attachmentService: AttachmentService,
                private alertService: XmAlertService,
                private toasterService: XmToasterService,
                private eventManager: JhiEventManager,
                private translateService: TranslateService) {
    }

    public ngOnInit(): void {
        if (this.isImage()) {
            this.loadImage();
        }
    }

    public isImage(): boolean {
        return this.attachment.hasOwnProperty('valueContentType')
            && this.attachment.valueContentType.startsWith('image');
    }

    public loadImage(): void {
        this.attachmentService
            .find(this.attachment.id)
            .subscribe((attachmentResp: HttpResponse<Attachment>) => {
                this.attachment.body = attachmentResp.body || {};
                if (this.attachment.body.content && this.attachment.body.content.value) {
                    this.imageSrc =
                        `data:${this.attachment.body.valueContentType};base64,` + this.attachment.body.content.value;
                } else {
                    this.imageSrc = (this.attachment.body && this.attachment.body.contentUrl) || null;
                }
            });
    }

    public getFileTypeImage(): string {
        let vct: string;
        if (this.attachment.contentUrl) {
            vct = this.attachment.contentUrl.split('.').pop();
        } else {
            vct = this.attachment.valueContentType.indexOf('/') > 0 ? this.attachment.valueContentType.split('/').pop()
                : this.attachment.valueContentType;
        }
        return this.availableFileTypeImages.includes(vct) ? `/assets/img/filetypes/filetype-${vct}.png` : null;
    }

    public getFileSize(precision: number): string {
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

    public onDownload(): void {
        if (this.attachment.contentUrl && !this.attachment.contentChecksum) {
            saveFileFromUrl(this.attachment.contentUrl, this.attachment.name);
        } else {
            if (this.attachment.body && this.attachment.body.content && this.attachment.body.content.value) {
                this.saveInnerAttachment(this.attachment.body);
            } else {
                this.attachmentService.find(this.attachment.id).subscribe(
                    (attachmentResp: HttpResponse<Attachment>) => this.saveInnerAttachment(attachmentResp.body));
            }
        }
    }

    public onRemove(): void {
        this.alertService.open({
            title: 'xm-entity.attachment-card.delete.title',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'xm-entity.attachment-card.delete.button',
        }).subscribe((result) => {
            if (result.value) {
                this.attachmentService.delete(this.attachment.id).subscribe(
                    () => {
                        this.eventManager.broadcast({
                            name: 'attachmentListModification',
                        });
                        this.toasterService.success('xm-entity.attachment-card.delete.remove-success');
                    },
                    () => this.toasterService.error('xm-entity.attachment-card.delete.remove-error'),
                );
            }
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
