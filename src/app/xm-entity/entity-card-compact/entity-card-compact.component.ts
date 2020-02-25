import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { XmToasterService } from '@xm-ngx/toaster';

import { JhiEventManager } from 'ng-jhipster';
import { finalize } from 'rxjs/operators';
import { Principal } from '../../shared/auth/principal.service';
import { buildJsfAttributes, nullSafe } from '../../shared/jsf-extention/jsf-attributes-helper';
import { EntityCardComponent } from '../entity-card/entity-card.component';
import { RatingListSectionComponent } from '../rating-list-section/rating-list-section.component';
import { XmEntityService } from '../shared/xm-entity.service';


@Component({
    selector: 'xm-entity-card-compact',
    templateUrl: './entity-card-compact.component.html',
    styleUrls: ['./entity-card-compact.component.scss'],
})
export class EntityCardCompactComponent extends EntityCardComponent implements OnInit {

    @ViewChild('rating', {static: false}) public rating: RatingListSectionComponent;

    @Input() public preventDefaultUpdateError?: boolean;
    @Output() public onSaveError: EventEmitter<boolean> = new EventEmitter<boolean>();

    public jsfAttributes: any;
    public showLoader: boolean;
    public isDescFull: boolean;

    constructor(
        protected modalService: MatDialog,
        public principal: Principal,
        private toasterService: XmToasterService,
        protected eventManager: JhiEventManager,
        protected translateService: TranslateService,
        protected xmEntityService: XmEntityService,
    ) {
        super(modalService, principal, eventManager);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.loadJsfAttr();
    }

    public onSubmitForm(data: any): void {
        this.showLoader = true;
        this.xmEntity.data = Object.assign({}, data);
        this.xmEntityService.update(this.xmEntity).pipe(finalize(() => this.showLoader = false))
            .subscribe(
                (res) => {
                    this.eventManager.broadcast({name: 'xmEntityDetailModification', content: {entity: res.body}});
                    this.xmEntity = Object.assign(this.xmEntity, res.body);
                    this.toasterService.success('xm-entity.entity-data-card.update-success');
                },
                (err) => {
                    if (!this.preventDefaultUpdateError) {
                        this.toasterService.error('xm-entity.entity-data-card.update-error');
                    } else {
                        this.onSaveError.emit(err);
                    }
                },
            );
    }

    protected loadJsfAttr(): void {
        if (this.xmEntitySpec && this.xmEntitySpec.dataSpec) {
            this.jsfAttributes = buildJsfAttributes(this.xmEntitySpec.dataSpec, this.xmEntitySpec.dataForm);
            this.jsfAttributes.data = Object.assign(nullSafe(this.jsfAttributes.data), nullSafe(this.xmEntity.data));
        }
    }

}
