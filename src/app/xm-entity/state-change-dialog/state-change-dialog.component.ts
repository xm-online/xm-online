import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';
import { finalize } from 'rxjs/operators';

import { Principal } from '../../shared/auth/principal.service';
import { ContextService } from '../../shared/context/context.service';
import { buildJsfAttributes } from '../../shared/jsf-extention/jsf-attributes-helper';
import { NextSpec } from '../shared/state-spec.model';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';

declare let swal: any;
declare let $: any;

@Component({
    selector: 'xm-state-change-dialog',
    templateUrl: './state-change-dialog.component.html',
    styleUrls: ['./state-change-dialog.component.scss']
})
export class StateChangeDialogComponent implements OnInit {

    @Input() xmEntity: XmEntity;
    @Input() nextSpec: NextSpec;
    @Input() dialogTitle: any;
    @Input() buttonTitle: any;

    jsfAttributes: any;
    formData: any = {};
    showLoader: boolean;
    isJsonFormValid = true;

    constructor(private activeModal: NgbActiveModal,
                private xmEntityService: XmEntityService,
                private translateService: TranslateService,
                private eventManager: JhiEventManager,
                private contextService: ContextService,
                public principal: Principal) {
    }

    ngOnInit() {
        // TODO: this is workaround to get eventManager from root injector
        this.eventManager = this.contextService.eventManager;
        // TODO think about correct way to work with context
        $.xmEntity = this.xmEntity;
        if (this.nextSpec && this.nextSpec.inputSpec) {
            this.jsfAttributes = buildJsfAttributes(this.nextSpec.inputSpec, this.nextSpec.inputForm);
        }
        $.xmEntity = null;
    }

    onChangeState() {
        this.showLoader = true;
        this.formData.xmEntity = this.xmEntity;
        this.xmEntityService.changeState(this.xmEntity.id, this.nextSpec.stateKey, this.formData).pipe(finalize(() => {
            this.showLoader = false;
        })).subscribe(
            (r) => {
                this.onSuccessFunctionCall(r);
            },
            (error) => this.alert('error', 'xm-entity.function-list-card.change-state.error')
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

    onSuccessFunctionCall(r: any) {
        const data = r.body;
        if (data && this.nextSpec.showResponse) {
            swal({
                type: 'success',
                html: `<pre style="text-align: left"><code>${JSON.stringify(data, null, '  ')}</code></pre>`,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-primary'
            });
        } else {
            this.alert('success', 'xm-entity.function-list-card.change-state.success');
        }
        this.activeModal.dismiss('OK');
    }

    onCancel() {
        this.activeModal.dismiss('cancel');
    }

    onChangeForm(data: any) {
        this.formData = data;
    }

}
