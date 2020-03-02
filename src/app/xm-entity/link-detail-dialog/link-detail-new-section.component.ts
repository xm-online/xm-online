import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { XmToasterService } from '@xm-ngx/toaster';
import { UUID } from 'angular2-uuid';
import { JhiEventManager } from 'ng-jhipster';
import { finalize } from 'rxjs/operators';

import { buildJsfAttributes, nullSafe } from '../../shared/jsf-extention/jsf-attributes-helper';
import { LinkSpec } from '../shared/link-spec.model';
import { Link } from '../shared/link.model';
import { Spec } from '../shared/spec.model';
import { XmEntitySpec } from '../shared/xm-entity-spec.model';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';

declare let $: any;

@Component({
    selector: 'xm-link-detail-new-section',
    templateUrl: './link-detail-new-section.component.html',
    styleUrls: ['./link-detail-new-section.component.scss'],
})
export class LinkDetailNewSectionComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() public linkSpec: LinkSpec;
    @Input() public sourceXmEntity: XmEntity;
    @Input() public spec: Spec;

    public xmEntity: XmEntity = {};
    public xmEntitySpec: XmEntitySpec;
    public availableSpecs: XmEntitySpec[];
    public jsfAttributes: any;
    public showLoader: boolean;
    public isJsonFormValid: boolean = true;
    public isEdit: boolean;

    constructor(private activeModal: MatDialogRef<LinkDetailNewSectionComponent>,
                private xmEntityService: XmEntityService,
                private changeDetector: ChangeDetectorRef,
                private eventManager: JhiEventManager,
                private toasterService: XmToasterService) {
        $.isAddNewLink = true;
    }

    public ngOnInit(): void {
        this.availableSpecs = this.spec.types
            .filter((t) => !t.isAbstract
                && (t.key.startsWith(this.linkSpec.typeKey + '.') || t.key === this.linkSpec.typeKey));
        this.xmEntity.key = UUID.UUID();
        this.onChangeEntityType(this.availableSpecs[0].key);
    }

    public ngAfterViewInit(): void {
        this.changeDetector.detectChanges();
    }

    public onChangeEntityType(typeKey: string): void {
        this.xmEntitySpec = this.availableSpecs.filter((s) => s.key === typeKey).shift();
        this.xmEntity.typeKey = this.xmEntitySpec.key;
        if (this.xmEntitySpec.dataSpec) {
            this.jsfAttributes = buildJsfAttributes(this.xmEntitySpec.dataSpec, this.xmEntitySpec.dataForm);
            this.jsfAttributes.data = Object.assign(nullSafe(this.jsfAttributes.data), nullSafe(this.xmEntity.data));
            if (this.jsfAttributes && this.jsfAttributes.entity
                && this.jsfAttributes.entity.hideNameAndDescription
                && !this.xmEntity.name) {
                this.xmEntity.name = '###';
            } else if (this.xmEntity.name === '###') {
                this.xmEntity.name = '';
            }
        }
    }

    public onConfirmSave(): void {
        this.showLoader = true;
        const link: Link = {};
        link.name = this.xmEntity.name;
        link.source = this.sourceXmEntity;
        link.typeKey = this.linkSpec.key;
        link.startDate = new Date().toISOString();
        this.xmEntity.stateKey = (this.xmEntitySpec.states && this.xmEntitySpec.states.length > 0) ?
            this.xmEntitySpec.states.shift().key :
            null;
        this.xmEntity.sources = [link];

        this.xmEntityService.create(this.xmEntity).pipe(finalize(() => this.showLoader = false))
            .subscribe(() => this.onSaveSuccess(),
                // TODO: error processing
                (err) => {
                    console.info(err);
                    this.showLoader = false;
                });
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }

    public onChangeForm(data: any): void {
        this.xmEntity.data = data;
    }

    public ngOnDestroy(): void {
        $.isAddNewLink = false;
    }

    private onSaveSuccess(): void {
        // TODO: use constant for the broadcast and analyse listeners
        this.eventManager.broadcast({name: 'xmEntityListModification'});
        this.eventManager.broadcast({name: 'linkListModification'});
        this.activeModal.close(true);
        this.toasterService.success('xm-entity.link-detail-dialog.add.success');
    }

}
