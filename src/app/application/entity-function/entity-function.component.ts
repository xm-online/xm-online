import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {XmEntity} from '../../entities/xm-entity/xm-entity.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EntityStateChangeDialogComponent} from '../entity-state/entity-state-change-dialog.component';
import {Principal} from '../../shared/auth/principal.service';
import {LinkedinProfileComponent} from './extract-linkedin-profile/linkedin-profile.component';
import {RedeemVoucherComponent} from './redeem-voucher/redeem-voucher.component';
import { AreaSquareComponent } from './area-square/area-square.component';
import {JhiLanguageService} from "ng-jhipster";

@Component({
    selector: 'xm-function-cmp',
    templateUrl: './entity-function.component.html'
})
export class EntityFunctionComponent implements OnChanges {

    @Input() xmEntity: XmEntity;
    @Input() functions: any[];
    @Input() nextStates: any[];
    @Input() functionsData: any[];

    functionsValue: any = {};

    mapComponents = {
        'ACCOUNT.EXTRACT-LINKEDIN-PROFILE': LinkedinProfileComponent,
        'ACCOUNT.REDEEM-VOUCHER': RedeemVoucherComponent,
        'AREA.SQUARE': AreaSquareComponent,
    };

    constructor(
        private principal: Principal,
        private modalService: NgbModal,
        private jhiLanguageService: JhiLanguageService
    ) {
        this.jhiLanguageService.addLocation('xmEntity');
    }

    ngOnChanges (changes: SimpleChanges) {
      changes.functions && changes.functions.currentValue && this.load();
    }

    changeState(stateKey) {
        return this.openDialog(EntityStateChangeDialogComponent, modalRef => {
            modalRef.componentInstance.xmEntity = this.xmEntity;
            modalRef.componentInstance.stateKey = stateKey;
        });
    }

    private load() {
        if (this.functionsData) {
            this.functionsData.forEach(func => {
                this.functionsValue[func.typeKey] = {
                    config: {
                        xmEntity: Object.assign({}, this.xmEntity),
                        func: Object.assign({}, func || {})
                    }
                };
            });
        }

        this.functions.forEach(func => {
            let findFuncData = this.functionsData && this.functionsData.length ? this.functionsData.find(el => el.typeKey == func.key) : null;
            func.isShowFormWithoutData = true; //TODO need delete. Workaround for always load Component
            if (this.mapComponents[func.key] && (func.isShowFormWithoutData || findFuncData)) {
                this.functionsValue[func.key] = {
                    config: {
                        xmEntity: Object.assign({}, this.xmEntity),
                        func: Object.assign({}, findFuncData || {})
                    }
                };
            }
        });
    }

    private openDialog(dialogClass, operation, options?) {
        const modalRef = this.modalService.open(dialogClass, options ? options : {});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        operation(modalRef);
        return modalRef;
    }
}
