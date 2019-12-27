import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LIST_DEFAULT_FIELDS } from '../../../shared/constants/default-lists-fields.constants';
import { Spec } from '../../../xm-entity';

@Component({
    selector: 'xm-entity-list-widget',
    templateUrl: './entity-list-widget.component.html',
    styleUrls: ['./entity-list-widget.component.scss'],
})
export class EntityListWidgetComponent implements OnInit {

    public config: any;
    public spec: Spec;
    public defaultFieldsKeys: string[] = [
        LIST_DEFAULT_FIELDS.name,
        LIST_DEFAULT_FIELDS.typeKey,
        LIST_DEFAULT_FIELDS.startDate,
        LIST_DEFAULT_FIELDS.stateKey,
    ];

    constructor(private translateService: TranslateService) {
    }

    public ngOnInit(): void {
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

    private buildDefaultFields(): object[] {
        return ['name', 'typeKey', 'startDate', 'stateKey'].map((item) => this.newField(item));
    }

    private newField(name: string): { field: string; title: string | any } {
        return {
            field: name,
            title: this.translateService.instant(LIST_DEFAULT_FIELDS[name]),
        };
    }
}
