import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiEventManager } from 'ng-jhipster';

import { getFieldValue } from '../../shared/helpers/entity-list-helper';
import { FieldOptions } from '../entity-list-card/entity-list-card-options.model';
import { FullLinkSpec } from '../shared/link-spec.model';
import { Link } from '../shared/link.model';
import { LinkService } from '../shared/link.service';
import { XmEntity } from '../shared/xm-entity.model';

@Component({
    selector: 'xm-link-list-card',
    templateUrl: './link-list-card.component.html',
    styleUrls: ['./link-list-card.component.scss'],
})
export class LinkListCardComponent implements OnInit, OnChanges {

    @Input() public xmEntity: XmEntity;
    @Input() public links: Link[];
    @Input() public linkSpec: FullLinkSpec;
    @Input() public modes: string[] = ['list'];
    @Input() public isBackLink: boolean = false;

    public mode: string = 'list';
    public treeRootLinks: Link[];

    public fields: FieldOptions[] = [
        {
            title: {trKey: 'xm-entity.common.fields.name'},
            field: 'name',
        },
        {
            title: {trKey: 'xm-entity.common.fields.description'},
            field: 'description',
        },
    ];

    constructor(private linkService: LinkService,
                private eventManager: JhiEventManager,
                private toasterService: XmToasterService,
                private alertService: XmAlertService,
                private translateService: TranslateService) {
    }

    public ngOnInit(): void {
        if (this.linkSpec.interface && this.linkSpec.interface.fields) {
            this.fields = this.linkSpec.interface.fields;
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.links
            && this.valueToLength(changes.links.previousValue) !== this.valueToLength(changes.links.currentValue)) {
            const link: Link = {};
            link.target = this.xmEntity;
            this.treeRootLinks = [link];
        }
    }

    public onRemove(link: Link): void {
        this.alertService.open({
            title: this.translateService.instant('xm-entity.link-list-card.delete.title'),
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: this.translateService.instant('xm-entity.link-list-card.delete.button'),
        }).subscribe((result) => {
            if (result.value) {
                this.linkService.delete(link.id).subscribe(
                    () => this.toasterService.success('xm-entity.link-list-card.delete.remove-success'),
                    () => this.toasterService.error('xm-entity.link-list-card.delete.remove-error'),
                    () => this.eventManager.broadcast({
                        name: 'linkListModification',
                    }),
                );
            }
        });
    }

    public getFieldValue(xmEntity: any = {}, field: FieldOptions): any {
        return getFieldValue(xmEntity, field);
    }

    private valueToLength(value: any[]): any {
        return value ? value.length : 0;
    }
}
