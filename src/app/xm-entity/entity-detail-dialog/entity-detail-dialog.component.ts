import { ChangeDetectorRef, Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { JhiEventManager } from 'ng-jhipster';
import { finalize } from 'rxjs/operators';
import * as formatString from 'string-template';

import { Principal } from '../../shared/auth/principal.service';
import { buildJsfAttributes, nullSafe } from '../../shared/jsf-extention/jsf-attributes-helper';
import { Spec } from '../shared/spec.model';
import { XmEntitySpec } from '../shared/xm-entity-spec.model';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';
import {XM_EVENT_LIST} from '../../xm.constants';

@Component({
    selector: 'xm-entity-detail-dialog',
    templateUrl: './entity-detail-dialog.component.html',
    styleUrls: ['./entity-detail-dialog.component.scss']
})
export class EntityDetailDialogComponent implements OnInit, AfterViewInit {

    @Input() xmEntity: XmEntity = {};
    @Input() xmEntitySpec: XmEntitySpec;
    @Input() spec: Spec;
    @Input() onSuccess: any;

    availableSpecs: XmEntitySpec[];
    selectedXmEntitySpec: XmEntitySpec;
    jsfAttributes: any;
    name: string;
    isEdit: boolean;
    showLoader: boolean;
    nameValidPattern: string;
    isJsonFormValid = true;
    smartDescription: any;

    constructor(private activeModal: NgbActiveModal,
                private changeDetector: ChangeDetectorRef,
                private xmEntityService: XmEntityService,
                private eventManager: JhiEventManager,
                public principal: Principal) {
        this.nameValidPattern = null;
        this.smartDescription = {
            active: false,
            value: '',
            template: ''
        }

    }

    ngOnInit() {
        this.isEdit = !!(this.xmEntity && this.xmEntity.id);
        this.smartDescription.active = true;
        if (this.isEdit) {
            this.name = this.xmEntity.name;
            this.smartDescription.value = this.xmEntity.description;
            this.onChangeEntityType(this.xmEntitySpec);
        } else {
            if (this.spec && this.spec.types) {
                this.availableSpecs = this.spec.types.filter((t) => !t.isAbstract && t.key.startsWith(this.xmEntitySpec.key));
                this.xmEntity.key = UUID.UUID();
                this.xmEntity.typeKey = this.availableSpecs[0].key;
                this.onChangeEntityType(null, this.xmEntity.typeKey);
            }
        }
    }

    ngAfterViewInit() {
        this.changeDetector.detectChanges();
    }

    onChangeEntityType(xmEntitySpec?: XmEntitySpec, typeKey?: string) {
        if (!xmEntitySpec) {
            xmEntitySpec = this.availableSpecs.filter((s) => s.key === typeKey).shift();
        }
        this.xmEntity.typeKey = xmEntitySpec.key;
        this.selectedXmEntitySpec = xmEntitySpec;
        if (xmEntitySpec.dataSpec) {
            this.jsfAttributes = buildJsfAttributes(xmEntitySpec.dataSpec, xmEntitySpec.dataForm);
            this.jsfAttributes.data = Object.assign(nullSafe(this.jsfAttributes.data), nullSafe(this.xmEntity.data));
        }
        this.nameValidPattern = xmEntitySpec.nameValidationPattern ? xmEntitySpec.nameValidationPattern : null;
        this.smartDescription.template = xmEntitySpec.descriptionPattern ? xmEntitySpec.descriptionPattern : null;

        if (this.jsfAttributes && this.jsfAttributes.entity && this.jsfAttributes.entity.hideNameAndDescription && !this.xmEntity.name) {
            this.xmEntity.name = '###';
        } else if (this.xmEntity.name === '###') {
            this.xmEntity.name = '';
        }
    }

    onConfirmSave() {
        this.showLoader = true;
        this.xmEntity.description = this.smartDescription.value;
        if (this.xmEntity.id !== undefined) {
            this.xmEntityService.update(this.xmEntity).pipe(finalize(() => this.showLoader = false))
                .subscribe((resp) => this.onSaveSuccess(resp.body),
                    // TODO: error processing
                    (err) => this.onConfirmError(err));
        } else {
            this.xmEntity.stateKey = this.selectedXmEntitySpec.states && this.selectedXmEntitySpec.states.length ?
                Object.assign([], this.selectedXmEntitySpec.states).shift().key : null;
            this.xmEntityService.create(this.xmEntity).pipe(finalize(() => this.showLoader = false))
                .subscribe((resp) => this.onSaveSuccess(resp.body),
                    // TODO: error processing
                    (err) => this.onConfirmError(err));
        }
    }

    private onConfirmError(err) {
        console.log(err);
        // disable form spinner
        this.showLoader = false;
    }

    private onSaveSuccess(entity: XmEntity) {
        // TODO: analyse listeners
        this.eventManager.broadcast({
            name: this.isEdit ? XM_EVENT_LIST.XM_ENTITY_DETAIL_MODIFICATION : XM_EVENT_LIST.XM_ENTITY_LIST_MODIFICATION,
            entityId: entity.id,
            entityType: entity.typeKey
        });
        this.activeModal.dismiss(true);
        if (this.onSuccess) {
            this.onSuccess();
        }
    }

    onCancel() {
        this.activeModal.dismiss('cancel');
    }

    onChangeForm(data: any) {
        this.xmEntity.data = data;
        this.formatSmartDescription(data);
    }

    private formatSmartDescription(data: any): void {
        if (this.smartDescription.active && this.smartDescription.template) {
            this.smartDescription.value = formatString(this.smartDescription.template, data);
        }
    }
}
