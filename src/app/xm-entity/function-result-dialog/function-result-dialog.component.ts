import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Principal } from '../../shared/auth/principal.service';
import { ContextService } from '../../shared/context/context.service';
import { buildJsfAttributes } from '../../shared/jsf-extention/jsf-attributes-helper';
import { XM_EVENT_LIST } from '../../xm.constants';
import { FunctionSpec } from '../shared/function-spec.model';
import { FunctionService } from '../shared/function.service';
import { XmEntity } from '../shared/xm-entity.model';
import { getFileNameFromResponseContentDisposition, saveFile } from '../../shared/helpers/file-download-helper';

declare let swal: any;
declare let $: any;

@Component({
    selector: 'xm-function-result-dialog',
    templateUrl: './function-result-dialog.component.html',
    styleUrls: ['./function-result-dialog.component.scss']
})
export class FunctionResultDialogComponent implements OnInit, AfterViewInit {

    @Input() xmEntity: XmEntity;
    @Input() functionSpec: FunctionSpec;
    @Input() dialogTitle: any;
    @Input() buttonTitle: any;
    @Input() onSuccess: any;

    jsfAttributes: any;
    formData: any = {};
    showLoader: boolean;
    isJsonFormValid = true;

    constructor(private activeModal: NgbActiveModal,
                private functionService: FunctionService,
                private eventManager: JhiEventManager,
                private contextService: ContextService,
                public principal: Principal,
                private ref: ChangeDetectorRef) {
    }

    ngOnInit() {
        // TODO: this is workaround to get eventManager from root injector
        this.eventManager = this.contextService.eventManager;
        // TODO think about correct way to work with context
        $.xmEntity = this.xmEntity;
        if (this.functionSpec) {
            this.jsfAttributes = buildJsfAttributes(this.functionSpec.inputSpec, this.functionSpec.inputForm);
        }
        $.xmEntity = null;
    }

    ngAfterViewInit() {
        this.ref.detectChanges();
    }

    onConfirmFunctionCall() {
        this.showLoader = true;
        this.formData.xmEntity = this.xmEntity;
        if (this.functionSpec.withEntityId) {
            this.functionService.callWithEntityId(this.xmEntity.id, this.functionSpec.key, this.formData).subscribe((r: any) => {
                    if (r.actionType && r.actionType === 'download') {
                        this.saveAsFile(r);
                    } else {
                        this.eventManager.broadcast({name: XM_EVENT_LIST.XM_FUNCTION_CALL_SUCCESS});
                        this.eventManager.broadcast({name: 'xmEntityDetailModification'});
                        this.activeModal.dismiss(true);
                        this.onSuccessFunctionCall(r);
                    }
                },
                // TODO: error processing
                () => this.showLoader = false);

        } else {
            this.functionService.call(this.functionSpec.key, this.formData).subscribe((r: any) => {
                    if (r.actionType && r.actionType === 'download') {
                        this.saveAsFile(r);
                    } else {
                        this.eventManager.broadcast({name: XM_EVENT_LIST.XM_FUNCTION_CALL_SUCCESS});
                        this.eventManager.broadcast({name: 'xmEntityDetailModification'});
                        this.activeModal.dismiss(true);
                        this.onSuccessFunctionCall(r);
                    }
                },
                // TODO: error processing
                (err) => this.showLoader = false);
        }

    }

    onSuccessFunctionCall(r: any) {
        const data = r.body && r.body.data;
        if (this.onSuccess) {
            this.onSuccess(data, this.formData);
        } else if (data && this.functionSpec.showResponse) {
            swal({
                type: 'success',
                html: `<pre style="text-align: left"><code>${JSON.stringify(data, null, '  ')}</code></pre>`,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-primary'
            });
        }
    }

    onCancel() {
        this.activeModal.dismiss('cancel');
    }

    onChangeForm(data: any) {
        this.formData = data;
    }

    private saveAsFile(r) {
        const filename = JSON.parse(getFileNameFromResponseContentDisposition(r));
        saveFile(r.body, filename, r.headers.get('content-type'));
        this.activeModal.dismiss(true);
    }
}
