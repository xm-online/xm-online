import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Response } from '@angular/http';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { XmEntity} from '../../entities/xm-entity';
import {Link} from "../../entities/link/link.model";
import {LinkService} from "../../entities/link/link.service";
import {LinkSpec, XmEntitySpecService} from "../../shared/spec/spec.service";
import {JsonSchemaFormComponent} from "angular2-json-schema-form";
import {FormGroup, NgForm} from "@angular/forms";
import {XmEntityService} from "../../entities/xm-entity/xm-entity.service";
import {I18nNamePipe} from "../../shared/language/i18n-name.pipe";
import { TranslateService } from 'ng2-translate/ng2-translate';
import {Principal} from "../../shared/auth/principal.service";

declare let $:any;
declare let moment:any;

@Component({
    selector: 'xm-location-dialog',
    templateUrl: './new-entity-link-dialog.component.html',
    styles: [`
        /deep/ .schema-form-submit {
            display: none;
        }
`]
})
export class NewEntityLinkDialogComponent implements OnInit, AfterViewInit {

    @ViewChild(JsonSchemaFormComponent) jsonSchemaForm: JsonSchemaFormComponent;

    authorities: any[];
    isSaving: boolean;

    xmEntity: XmEntity;
    typeKey: string;

    link: Link;
    linkType: LinkSpec;

    formData: any;

    entityTypes: any;

    newXmEntity: XmEntity;

    constructor(
        public activeModal: NgbActiveModal,
        public principal: Principal,
        private alertService: AlertService,
        private eventManager: EventManager,
        private linkService: LinkService,
        private xmEntitySpecService: XmEntitySpecService,
        private xmEntityService: XmEntityService,
        private jhiLanguageService: JhiLanguageService,
        private translateService: TranslateService,
        private i18nNamePipe: I18nNamePipe,
    ) {
        this.link = new Link();
        this.link.source = new XmEntity();
        this.newXmEntity = new XmEntity();
        this.newXmEntity.key = UUID.UUID();
        this.jhiLanguageService.addLocation('link');
        this.jhiLanguageService.addLocation('xmEntity');
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.entityTypes = this.xmEntitySpecService.findNonAbstractTypesByPrefix(this.linkType.typeKey);

        this.link.source.data = this.xmEntity.data;

        this.link.source.id = this.xmEntity.id;
        this.link.source.typeKey = this.xmEntity.typeKey;

        if (!this.link.startDate) {
            this.link.startDate = new Date().toISOString();
        }
        if (!this.newXmEntity.startDate) {
            this.newXmEntity.startDate = new Date().toISOString();
        }

        this.newXmEntity.updateDate = new Date().toISOString();
        if (this.entityTypes.length && !this.entityTypes.find(el => el.key == this.newXmEntity.typeKey)) {
            this.newXmEntity.typeKey = this.entityTypes[0].key;
        }
    }

    ngAfterViewInit() {
        //  Init Bootstrap Select Picker
        setTimeout(() => {
            let selectpickers = $('.selectpicker');
            selectpickers.length && selectpickers.selectpicker();
        }, 10);
    }

    onEntityTypeSelect(typeKey, nameCtrl) {
        this.formData = this.xmEntitySpecService.getFormData(typeKey);
        if (typeKey) {
            let type = this.entityTypes.find(el => el.key == typeKey);
            this.translateService.get('global.new').subscribe(result => {
                this.link.name = [result, this.i18nNamePipe.transform(type.name, this.principal), moment().format('YYYY-MM-DD HH:mm')].join(" ")
                nameCtrl.classList.remove('is-empty');
            });
        }
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    private validateForm(form: FormGroup): boolean {
        if (form.valid) {
            return true;
        }
        for (let controlName in form.controls) {
            let control = form.controls[controlName];
            if (control.valid) {
                continue;
            }
            control.updateValueAndValidity();
            control.markAsTouched(true);
            control.markAsDirty(true);

        }
        form.updateValueAndValidity();
        form.markAsTouched();
        form.markAsDirty();
        return false;
    }

    save(editForm: NgForm) {

        let mainFormInvalid = !this.validateForm(editForm.control);
        let jsonFormInvalid = this.jsonSchemaForm && !this.validateForm(this.jsonSchemaForm.jsfObject.formGroup);

        if (mainFormInvalid || jsonFormInvalid) {
            return;
        }

        this.isSaving = true;

        this.link.typeKey = this.linkType.key;
        this.newXmEntity.sources = [this.link];
        this.newXmEntity.name = this.link.name;
        this.newXmEntity.description = this.link.description;

        let states = this.xmEntitySpecService.getStates(this.newXmEntity.typeKey);
        if (!this.newXmEntity.stateKey && states && states.length) {
            this.newXmEntity.stateKey = states[0].key;
        }

        if (this.jsonSchemaForm) {
            this.newXmEntity.data = this.jsonSchemaForm.jsfObject.data;
        }

        if (this.link.id !== undefined) {
            this.xmEntityService.update(this.link)
                .subscribe((res: XmEntity) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        } else {
            this.xmEntityService.create(this.newXmEntity)
                .subscribe((res: XmEntity) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        }
    }


    showFormLayoutFn (data: any) {
        setTimeout(() => {
            let checkboxList: HTMLElement[] = $('checkbox-widget');
            for (let checkbox of checkboxList) {
                $(checkbox)
                    .addClass('checkbox')
                    .find('input')
                    .after(`<span class="checkbox-material"><span class="check"></span></span>`);
            }
        });
    }

    private onSaveSuccess(result: any) {
        this.eventManager.broadcast({ name: 'linkListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        this.isSaving = false;
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }


}
