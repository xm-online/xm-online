import {Component, OnInit, AfterViewInit} from '@angular/core';
import { Response } from '@angular/http';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {EventManager, AlertService, JhiLanguageService, DataUtils} from 'ng-jhipster';

import { XmEntity } from '../../entities/xm-entity';
import { Attachment } from '../../entities/attachment/attachment.model';
import { AttachmentService } from '../../entities/attachment/attachment.service';
import { Content } from '../../entities/content/content.model';
import {Principal} from "../../shared/auth/principal.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import {I18nNamePipe} from "../../shared/language/i18n-name.pipe";
import {NgForm, NgModel} from "@angular/forms";

declare let $: any;
declare let moment: any;

@Component({
    selector: 'xm-attachment-dialog',
    templateUrl: './entity-attachment-dialog.component.html'
})
export class EntityAttachmentDialogComponent implements OnInit, AfterViewInit {

    attachment: Attachment;
    attachmentTypes: any[];
    authorities: any[];
    isSaving: boolean;

    xmEntity: XmEntity;
    typeKey: string;


    constructor(
        public activeModal: NgbActiveModal,
        public principal: Principal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private dataUtils: DataUtils,
        private attachmentService: AttachmentService,
        private translateService: TranslateService,
        private i18nNamePipe: I18nNamePipe,
    ) {
        this.jhiLanguageService.addLocation('attachment');
        this.jhiLanguageService.addLocation('xmEntity');
        this.attachment = new Attachment();
        this.attachment.xmEntity = new XmEntity();
        this.attachment.content = new Content();
        this.attachment.name = '';
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        if (!this.attachment.startDate) {
            this.attachment.startDate = new Date().toISOString();
        }
        if (!this.attachment.content) {
            this.attachment.content = new Content();
        }
        if (this.attachmentTypes.length && !this.attachmentTypes.find(el => el.key == this.attachment.typeKey)) {
            this.attachment.typeKey = this.attachmentTypes[0].key;
        }
    }

    ngAfterViewInit() {
        //  Init Bootstrap Select Picker
        setTimeout(() => {
            let selectpickers = $('.selectpicker');
            selectpickers.length && selectpickers.selectpicker();
        }, 10);
    }

    byteSize(field, size) {
        if (field == null) {
            return size + ' bytes';
        }
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, field) {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const attachmentSpec = this.findAttachmentTypeByKey(this.attachment.typeKey);

            if (attachmentSpec && attachmentSpec.contentTypes) {
                if (attachmentSpec.contentTypes.filter((type: string) => type === file.type).length <= 0) {
                    // TODO type validation
                }
            }
            this.dataUtils.toBase64(file, (base64Data) => {
                this.attachment.content.value = base64Data;
                this.attachment.valueContentType = file.type;
            });
        }
    }

    onChangeType (nameCtrl) {
        if (this.attachment.typeKey) {
            let type = this.attachmentTypes.find(el => el.key == this.attachment.typeKey);
            this.translateService.get('global.new').subscribe(result => {
                this.attachment.name = [result, this.i18nNamePipe.transform(type.name, this.principal), moment().format('YYYY-MM-DD HH:mm')].join(" ");
                nameCtrl.classList.remove('is-empty');
            });
        }
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
        if (this.attachment.id !== undefined) {
            this.attachment.xmEntity = new XmEntity();
            this.attachment.xmEntity.id = this.xmEntity.id;
            this.attachment.xmEntity.typeKey = this.xmEntity.typeKey;
            this.attachmentService.update(this.attachment)
                .subscribe((res: Attachment) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        } else {
            this.attachment.xmEntity.id = this.xmEntity.id;
            this.attachment.xmEntity.typeKey = this.xmEntity.typeKey;
            this.attachmentService.create(this.attachment)
                .subscribe((res: Attachment) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        }
    }

    private onSaveSuccess(result: Attachment) {
        this.eventManager.broadcast({ name: 'attachmentListModification', content: 'OK'});
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

    private findAttachmentTypeByKey(key) {
        return this.attachmentTypes.filter((att: any) => att.key === key)[0];
    }

}

