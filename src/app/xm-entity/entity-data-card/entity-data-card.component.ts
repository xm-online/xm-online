import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

import { Principal } from '../../shared/auth/principal.service';
import { buildJsfAttributes, nullSafe } from '../../shared/jsf-extention/jsf-attributes-helper';
import { XmEntitySpec } from '../shared/xm-entity-spec.model';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';


declare let swal: any;

@Component({
    selector: 'xm-entity-data-card',
    templateUrl: './entity-data-card.component.html',
    styleUrls: ['./entity-data-card.component.scss']
})
export class EntityDataCardComponent implements OnInit, OnChanges {

    @Input() xmEntity: XmEntity;
    @Input() xmEntitySpec: XmEntitySpec;
    @Input() preventDefaultUpdateError?: boolean;
    @Output() onSaveError = new EventEmitter<boolean>();

    jsfAttributes: any;
    showLoader: boolean;

    constructor(private xmEntityService: XmEntityService,
                private translateService: TranslateService,
                private eventManager: JhiEventManager,
                public principal: Principal) {
    }

    ngOnInit() {
        this.load();
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    private load() {
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
                    this.alert('error', 'xm-entity.entity-data-card.update-error')
                } else {
                    this.onSaveError.emit(err);
                }
            }
        );
    }

    private alert(type, key) {
        swal({
            type: type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary'
        });
    }

}
