import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import {XmEntity} from "../../entities/xm-entity/xm-entity.model";
import {XmEntityService} from "../../entities/xm-entity/xm-entity.service";

@Component({
    selector: 'xm-state-change-dialog',
    templateUrl: './entity-state-change-dialog.component.html'
})
export class EntityStateChangeDialogComponent {

    stateKey: string;
    xmEntity: XmEntity;
    isDisable: boolean = false;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private xmEntityService: XmEntityService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.addLocation('state');
    }

    clear() {
        this.isDisable = false;
        this.activeModal.dismiss('cancel');
    }

    confirmChange() {
        this.isDisable = true;
        this.xmEntityService.changeState(this.xmEntity.id, this.stateKey)
            .finally(() => this.isDisable = false)
            .subscribe((response) => {
                this.eventManager.broadcast({
                    name: 'xmEntityDetailModification',
                    content: 'Change a xmEntity'
                });
                this.activeModal.dismiss(true);
            });
    }

}
