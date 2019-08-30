import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';

import { Principal } from '../../shared/auth/principal.service';
import {FullLinkSpec, LinkSpec} from '../shared/link-spec.model';
import { Link } from '../shared/link.model';
import { LinkService } from '../shared/link.service';
import { XmEntity } from '../shared/xm-entity.model';
import {FieldOptions} from '../entity-list-card/entity-list-card-options.model';
import {getFieldValue} from '../../shared/helpers/entity-list-helper';

declare let swal: any;

@Component({
    selector: 'xm-link-list-card',
    templateUrl: './link-list-card.component.html',
    styleUrls: ['./link-list-card.component.scss']
})
export class LinkListCardComponent implements OnInit, OnChanges {

    @Input() xmEntity: XmEntity;
    @Input() links: Link[];
    @Input() linkSpec: FullLinkSpec;
    @Input() modes: string[] = ['list'];
    @Input() isBackLink = false;

    mode = 'list';
    treeRootLinks: Link[];

    fields: FieldOptions[] = [
        {
            title: { trKey: 'xm-entity.common.fields.name' },
            field: 'name'
        },
        {
            title: { trKey: 'xm-entity.common.fields.description' },
            field: 'description'
        }
    ];

    constructor(private linkService: LinkService,
                private eventManager: JhiEventManager,
                private translateService: TranslateService,
                public principal: Principal) {
    }

    ngOnInit() {
        if (this.linkSpec.interface && this.linkSpec.interface.fields) {
            this.fields = this.linkSpec.interface.fields;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.links && this.valueToLength(changes.links.previousValue) !== this.valueToLength(changes.links.currentValue)) {
            const link = new Link();
            link.target = this.xmEntity;
            this.treeRootLinks = [link];
        }
    }

    private valueToLength(value) {
        return value ? value.length : 0;
    }

    onRemove(link: Link) {
        swal({
            title: this.translateService.instant('xm-entity.link-list-card.delete.title'),
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-raised-button btn-primary',
            cancelButtonClass: 'btn mat-raised-button',
            confirmButtonText: this.translateService.instant('xm-entity.link-list-card.delete.button')
        }).then((result) => {
            if (result.value) {
                this.linkService.delete(link.id).subscribe(
                    () => this.alert('success', 'xm-entity.link-list-card.delete.remove-success'),
                    () => this.alert('error', 'xm-entity.link-list-card.delete.remove-error'),
                    () => this.eventManager.broadcast({
                        name: 'linkListModification'
                    })
                );
            }
        });
    }

    private alert(type, key) {
        swal({
            type: type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary'
        });
    }

    getFieldValue(xmEntity: any = {}, field: FieldOptions): any {
        return getFieldValue(xmEntity, field);
    }

}
