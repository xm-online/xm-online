import {Component, OnInit, AfterViewInit} from '@angular/core';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Location } from '../../entities/location/location.model';
import { LocationService } from '../../entities/location/location.service';
import { XmEntity } from '../../entities/xm-entity';
import {I18nNamePipe} from "../../shared/language/i18n-name.pipe";
import { TranslateService } from 'ng2-translate/ng2-translate';
import {Principal} from "../../shared/auth/principal.service";

declare let $: any;
declare let moment: any;

@Component({
    selector: 'xm-location-dialog',
    templateUrl: './entity-location-dialog.component.html'
})
export class EntityLocationDialogComponent implements OnInit, AfterViewInit {

    location: Location;
    locationTypes: any[];
    authorities: any[];
    isSaving: boolean;

    xmEntity: XmEntity;
    typeKey: string;

    constructor(
        public activeModal: NgbActiveModal,
        public principal: Principal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private locationService: LocationService,
        private eventManager: EventManager,
        private translateService: TranslateService,
        private i18nNamePipe: I18nNamePipe,
    ) {
        this.jhiLanguageService.addLocation('location');
        this.jhiLanguageService.addLocation('xmEntity');
        this.location = new Location();
        this.location.xmEntity = new XmEntity();
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        if (this.locationTypes.length && !this.locationTypes.find(el => el.key == this.location.typeKey)) {
            this.location.typeKey = this.locationTypes[0].key
        }
    }

    ngAfterViewInit() {
        //  Init Bootstrap Select Picker
        setTimeout(() => {
            let selectpickers = $('.selectpicker');
            selectpickers.length && selectpickers.selectpicker();
        }, 10);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save(editForm) {

        if (!editForm.valid) {
            for (let controlName in editForm.controls) {
                let control = editForm.controls[controlName];
                if (control.valid) {
                    continue;
                }
                control.markAsTouched(true);
                control.markAsDirty(true);
            }
            return;
        }


        this.isSaving = true;
        if (this.location.id !== undefined) {
            this.location.xmEntity = new XmEntity();
            this.location.xmEntity.id = this.xmEntity.id;
            this.location.xmEntity.typeKey = this.xmEntity.typeKey;
            this.locationService.update(this.location)
                .subscribe((res: Location) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        } else {
            this.location.xmEntity.id = this.xmEntity.id;
            this.location.xmEntity.typeKey = this.xmEntity.typeKey;
            this.locationService.create(this.location)
                .subscribe((res: Location) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        }
    }

    onChangeType (nameCtrl) {
        if (this.location.typeKey) {
            let type = this.locationTypes.find(el => el.key == this.location.typeKey);
            this.translateService.get('global.new').subscribe(result => {
                this.location.name = [result, this.i18nNamePipe.transform(type.name, this.principal), moment().format('YYYY-MM-DD HH:mm')].join(" ")
                nameCtrl.classList.remove('is-empty');
            });
        }
    }

    private onSaveSuccess(result: Location) {
        this.eventManager.broadcast({ name: 'locationListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackXmEntityById(index: number, item: XmEntity) {
        return item.id;
    }
}
