import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

import { Principal } from '../../shared/auth/principal.service';
import { AvatarDialogComponent } from '../avatar-dialog/avatar-dialog.component';
import { XmEntitySpec } from '../shared/xm-entity-spec.model';
import { XmEntity } from '../shared/xm-entity.model';
import { JhiEventManager } from 'ng-jhipster';
import { XM_EVENT_LIST } from '../../xm.constants';
import { FunctionSpec } from '..';
import { EntityCardComponent } from '../entity-card/entity-card.component';
import { RatingListSectionComponent } from '../rating-list-section/rating-list-section.component';
import { XmEntityService } from '../shared/xm-entity.service';
import { buildJsfAttributes, nullSafe } from '../../shared/jsf-extention/jsf-attributes-helper';

declare let swal: any;

@Component({
    selector: 'xm-entity-card-compact',
    templateUrl: './entity-card-compact.component.html',
    styleUrls: ['./entity-card-compact.component.scss'],
})
export class EntityCardCompactComponent extends EntityCardComponent implements OnInit {

    @ViewChild('rating', {static: false}) rating: RatingListSectionComponent;

    @Input() preventDefaultUpdateError?: boolean;
    @Output() onSaveError = new EventEmitter<boolean>();

    jsfAttributes: any;
    showLoader: boolean;
    isDescFull: boolean;

    constructor(
        protected modalService: NgbModal,
        public principal: Principal,
        protected eventManager: JhiEventManager,
        protected translateService: TranslateService,
        protected xmEntityService: XmEntityService,
    ) {
        super(modalService, principal, eventManager);
    }

    ngOnInit() {
        super.ngOnInit();
        this.loadJsfAttr();
    }

    protected loadJsfAttr() {
        if (this.xmEntitySpec && this.xmEntitySpec.dataSpec) {
            this.jsfAttributes = buildJsfAttributes(this.xmEntitySpec.dataSpec, this.xmEntitySpec.dataForm);
            this.jsfAttributes.data = Object.assign(nullSafe(this.jsfAttributes.data), nullSafe(this.xmEntity.data));
        }
    }

    onSubmitForm(data: any) {
        this.showLoader = true;
        this.xmEntity.data = Object.assign({}, data);
        this.xmEntityService.update(this.xmEntity).pipe(finalize(() => this.showLoader = false))
            .subscribe(
                (res) => {
                    this.eventManager.broadcast({name: 'xmEntityDetailModification', content: {entity: res.body}});
                    this.xmEntity = Object.assign(this.xmEntity, res.body);
                    this.alert('success', 'xm-entity.entity-data-card.update-success');
                },
                (err) => {
                    if (!this.preventDefaultUpdateError) {
                        this.alert('error', 'xm-entity.entity-data-card.update-error');
                    } else {
                        this.onSaveError.emit(err);
                    }
                },
            );
    }

    protected alert(type, key) {
        swal({
            type: type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary',
        });
    }

}
