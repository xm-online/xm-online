import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { EntityPopupService } from './entity-popup.service';
import { XmEntity } from '../entities/xm-entity/xm-entity.model';
import { XmEntityService } from '../entities/xm-entity/xm-entity.service';

@Component({
    selector: 'xm-entity-delete-dialog',
    templateUrl: './entity-delete-dialog.component.html'
})
export class EntityDeleteDialogComponent {

    xmEntity: XmEntity;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private xmEntityService: XmEntityService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.addLocation('comment');
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.xmEntityService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'xmEntityListModification',
                content: 'Deleted an xmEntity'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'xm-entity-delete-popup',
    template: ''
})
export class EntityDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private xmEntityPopupService: EntityPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.xmEntityPopupService
                .open(EntityDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
