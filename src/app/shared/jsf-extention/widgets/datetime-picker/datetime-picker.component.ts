import { Component, Input, OnInit } from '@angular/core';
import { JsonSchemaFormService } from 'angular2-json-schema-form';
import { DateTimeAdapter, OwlDateTimeIntl } from 'ng-pick-datetime';
import { TranslateService } from '@ngx-translate/core';

import { Principal } from '../../../auth/principal.service';
import { DatetimePickerOptionsModel } from './datetime-picker-options.model';
import { ModulesLanguageHelper } from '../../../language/modules-language.helper';

declare let moment;
const DEF_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss[Z]';

@Component({
    selector: 'xm-ajfs-datetime-picker',
    templateUrl: './datetime-picker.component.html',
    styleUrls: ['./datetime-picker.component.scss']
})
export class DatetimePickerComponent implements OnInit {

    @Input() layoutNode: any;

    controlValue: any;
    controlValueDisplayed: any;
    options: DatetimePickerOptionsModel;

    constructor(private jsf: JsonSchemaFormService,
                private translateService: TranslateService,
                private dateTimeAdapter: DateTimeAdapter<any>,
                private dateTimeAdapterLabels: OwlDateTimeIntl,
                private modulesLanguageHelper: ModulesLanguageHelper,
                public principal: Principal) {
        this.dateTimeAdapter.setLocale(this.modulesLanguageHelper.getLangKey());
    }

    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        this.setLocalizedButtons();
        if (this.controlValue) {
            const formatString = this.getFormat();
            this.controlValueDisplayed = moment(this.controlValue).local().format(formatString);
        }
    }

    updateValue(event) {
        const value = event.value || null;
        const formatString = this.getFormat();
        this.controlValueDisplayed = moment(this.controlValue).local().format(formatString);
        this.jsf.updateValue(this, moment(value).utc().format(DEF_FORMAT));
    }

    private getFormat() {
        return this.options && this.options['formatString'] ? this.options['formatString'] : DEF_FORMAT;
    }

    private setLocalizedButtons() {
        this.dateTimeAdapterLabels.cancelBtnLabel = this.translateService.instant('global.common.cancel');
        this.dateTimeAdapterLabels.setBtnLabel = this.translateService.instant('global.common.set');
    }
}
