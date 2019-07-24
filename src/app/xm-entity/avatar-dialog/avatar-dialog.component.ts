import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';
import { XmEntity } from '../shared/xm-entity.model';

import { XmEntityService } from '../shared/xm-entity.service';

@Component({
    selector: 'xm-avatar-dialog',
    templateUrl: './avatar-dialog.component.html',
    styleUrls: ['./avatar-dialog.component.scss']
})
export class AvatarDialogComponent implements OnInit {

    @Input() xmEntity: XmEntity;

    @ViewChild('cropper', {static: false}) cropper: ImageCropperComponent;

    cropperSettings: CropperSettings;
    data: any;
    showLoader: boolean;

    constructor(private activeModal: NgbActiveModal,
                private xmEntityService: XmEntityService,
                private eventManager: JhiEventManager) {
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.preserveSize = true;
        this.data = {};
    }

    ngOnInit() {
    }

    onFileChange($event) {
        const image = new Image();
        const file = $event.target.files[0];
        const myReader = new FileReader();
        const that = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);

        };
        myReader.readAsDataURL(file);
    }

    onSave() {
        this.showLoader = true;
        let file = this.dataURItoBlob(this.data.image);
        try {
            file = new File([file], 'avatar-' + this.xmEntity.id);
        } catch (err) {
            // window.navigator.msSaveBlob(file, 'avatar-' + this.xmEntity.id);
        }
        this.xmEntityService.createAvatar(file).subscribe((avatarUrl) => {
            this.xmEntityService.find(this.xmEntity.id, {'embed': 'data'}).subscribe((xmEntity: HttpResponse<XmEntity>) => {
                const xmEntityCopy = xmEntity.body;
                xmEntityCopy.avatarUrl = avatarUrl;
                this.xmEntityService.update(xmEntityCopy).subscribe(() => {
                    this.eventManager.broadcast({
                        name: 'xmEntityDetailModification'
                    });
                    this.activeModal.dismiss('save');
                });
            });
        });
    }

    onCancel() {
        this.activeModal.dismiss('cancel');
    }

    private dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {type: mimeString});
    }

}
