import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Spec } from '../../../xm-entity';
import { LIST_DEFAULT_FIELDS } from '../../../shared/constants/default-lists-fields.constants';

@Component({
    selector: 'xm-entity-list-widget',
    templateUrl: './entity-list-widget.component.html',
    styleUrls: ['./entity-list-widget.component.scss']
})
export class EntityListWidgetComponent implements OnInit {

    config: any;
    spec: Spec;
    defaultFieldsKeys: string[] = [
        LIST_DEFAULT_FIELDS['name'],
        LIST_DEFAULT_FIELDS['typeKey'],
        LIST_DEFAULT_FIELDS['startDate'],
        LIST_DEFAULT_FIELDS['stateKey']
    ];

    constructor(private translateService: TranslateService) {
    }

    ngOnInit() {
        if (this.config && this.config.entities) {
            for (const entityOptions of this.config.entities) {
                if (!entityOptions.fields) {
                    this.translateService.get(this.defaultFieldsKeys).subscribe(() => {
                        entityOptions.fields = this.buildDefaultFields();
                    });
                }
            }
        }
    }

    private buildDefaultFields(): Array<Object> {
        return [
            {
                field: 'name',
                title: this.translateService.instant(LIST_DEFAULT_FIELDS['name'])
            },
            {
                field: 'typeKey',
                title: this.translateService.instant(LIST_DEFAULT_FIELDS['typeKey'])
            },
            {
                field: 'startDate',
                title: this.translateService.instant(LIST_DEFAULT_FIELDS['startDate'])
            },
            {
                field: 'stateKey',
                title: this.translateService.instant(LIST_DEFAULT_FIELDS['stateKey'])
            }
        ]
    }
}
