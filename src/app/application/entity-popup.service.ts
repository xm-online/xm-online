import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

import { XmEntityService } from '../entities/xm-entity/xm-entity.service';
import { XmEntity } from '../entities/xm-entity/xm-entity.model';

@Injectable()
export class EntityPopupService {
    private isOpen = false;
    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private xmEntityService: XmEntityService

    ) {}

    open(component: Component, typeKey: string, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.xmEntityService.find(id).subscribe((xmEntity) => {
                xmEntity.startDate = this.datePipe
                    .transform(xmEntity.startDate, 'yyyy-MM-ddThh:mm');
                xmEntity.updateDate = this.datePipe
                    .transform(xmEntity.updateDate, 'yyyy-MM-ddThh:mm');
                xmEntity.endDate = this.datePipe
                    .transform(xmEntity.endDate, 'yyyy-MM-ddThh:mm');
                this.xmEntityModalRef(component, xmEntity);
            });
        } else {
            const xmEntity = new XmEntity();
            xmEntity.typeKey = typeKey;
            xmEntity.key = this.guid();
            xmEntity.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddThh:mm');
            xmEntity.updateDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddThh:mm');
            return this.xmEntityModalRef(component, xmEntity);
        }
    }

    s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    guid() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    xmEntityModalRef(component: Component, xmEntity: XmEntity): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.xmEntity = xmEntity;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
