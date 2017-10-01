import {Component, OnInit, OnDestroy, AfterViewInit, ElementRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Response} from '@angular/http';

import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {EventManager, AlertService, JhiLanguageService} from 'ng-jhipster';
import {XmEntity} from '../entities/xm-entity/xm-entity.model';
import {XmEntityService} from '../entities/xm-entity/xm-entity.service';
import {EntityPopupService} from './entity-popup.service';
import {XmEntitySpecService} from '../shared/spec/spec.service';
import {I18nNamePipe} from '../shared/language/i18n-name.pipe';
import {Principal} from '../shared/auth/principal.service';

declare let $:any;

@Component({
    selector: 'xm-entity-dialog',
    templateUrl: './entity-dialog.component.html'
})
export class EntityDialogComponent implements OnInit, AfterViewInit {

    xmEntity: XmEntity;
    authorities: any[];
    typeKey: string;
    entityTypes: any;
    isSaving: boolean;
    formData: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private xmEntitySpecService: XmEntitySpecService,
        private xmEntityService: XmEntityService,
        private eventManager: EventManager,
        private i18nNamePipe: I18nNamePipe,
        private jhiLanguageService: JhiLanguageService,
        private principal: Principal,
        private elementRef: ElementRef,

    ) {
        this.jhiLanguageService.addLocation('xmEntity');
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.typeKey = this.xmEntity.typeKey;
        this.entityTypes = this.xmEntitySpecService.findNonAbstractTypesByPrefix(this.typeKey);
        if (this.entityTypes.length && !this.entityTypes.find(el => el.key == this.xmEntity.typeKey)) {
            this.xmEntity.typeKey = this.entityTypes[0].key;
        }
        this.formData = this.xmEntitySpecService.getFormData(this.typeKey);
    }

    ngAfterViewInit() {
        //  Init Bootstrap Select Picker
        setTimeout(() => {
            let selectpickers = $('.selectpicker');
            selectpickers.length && selectpickers.selectpicker();
        }, 10);
    }

    onChangeForm(data: any) {
        this.xmEntity.data = data;
    }

    showFormLayoutFn (data: any) {
        setTimeout(() => {
            let checkboxList: HTMLElement[] = this.elementRef.nativeElement.querySelectorAll('checkbox-widget');
            for (let checkbox of checkboxList) {
                $(checkbox)
                    .addClass('checkbox')
                    .find('input')
                    .after(`<span class="checkbox-material"><span class="check"></span></span>`);
            }
        });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.xmEntity.id !== undefined) {
            this.xmEntityService.update(this.xmEntity)
                .subscribe((res: XmEntity) =>
                    this.onSaveSuccess(res, true), (res: Response) => this.onSaveError(res));
        } else {
            const states = this.xmEntitySpecService.getStates(this.xmEntity.typeKey);
            this.xmEntity.stateKey = states ? states[0].key : null;
            this.xmEntityService.create(this.xmEntity)
                .subscribe((res: XmEntity) =>
                    this.onSaveSuccess(res, false), (res: Response) => this.onSaveError(res));
        }
    }

    private onSaveSuccess(result: XmEntity, isEdit: boolean) {
        this.eventManager.broadcast({ name: isEdit ? 'xmEntityDetailModification' : 'xmEntityListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.message = error.json().error;
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

}

@Component({
    selector: 'xm-entity-popup',
    template: ''
})
export class EntityPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private xmEntityPopupService: EntityPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.xmEntityPopupService
                    .open(EntityDialogComponent, params['key'], params['id']);
            } else {
                this.modalRef = this.xmEntityPopupService
                    .open(EntityDialogComponent, params['key']);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
