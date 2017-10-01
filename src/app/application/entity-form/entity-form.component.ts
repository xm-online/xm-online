import {Component, Input, OnInit} from '@angular/core';
import {XmEntity} from "../../entities/xm-entity/xm-entity.model";
import {XmEntityService} from "../../entities/xm-entity/xm-entity.service";
import {JhiLanguageService} from 'ng-jhipster';

declare let $: any;

@Component({
    selector: 'xm-entity-form-cmp',
    templateUrl: './entity-form.component.html'
})
export class EntityFormComponent implements OnInit {

    @Input() xmEntity: XmEntity;
    @Input() formData: any;

    constructor (
        private jhiLanguageService: JhiLanguageService,
        private xmEntityService: XmEntityService,
    ) {
        this.jhiLanguageService.addLocation('xmEntity');
    }

    ngOnInit() {
    }

    onSubmitForm(data: any) {
        this.xmEntity.data = Object.assign({}, data);
        this.xmEntityService.update(this.xmEntity)
            .subscribe(
                (resp: XmEntity) => console.log('SUCCESS: Save Form data.'),
                (resp: Response) => console.log('ERROR: Form data not saved.')
            );
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

}
