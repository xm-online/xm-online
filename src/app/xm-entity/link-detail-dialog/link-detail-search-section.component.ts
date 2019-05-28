import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';

import { LinkSpec } from '../shared/link-spec.model';
import { Link } from '../shared/link.model';
import { LinkService } from '../shared/link.service';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';
import { XmConfigService } from '../../shared';
import { filter, map } from 'rxjs/operators';

declare let swal: any;

@Component({
    selector: 'xm-link-detail-search-section',
    templateUrl: './link-detail-search-section.component.html',
    styleUrls: ['./link-detail-search-section.component.scss']
})
export class LinkDetailSearchSectionComponent implements OnInit {

    @Input() linkSpec: LinkSpec;
    @Input() sourceXmEntity: XmEntity;

    xmEntity: XmEntity = new XmEntity();
    searchQuery: string;
    searchXmEntities: XmEntity[];
    page: number;
    total: number;
    showLoader: boolean;
    linkSpecQuery: any;

    constructor(private activeModal: NgbActiveModal,
                private xmEntityService: XmEntityService,
                private linkService: LinkService,
                private eventManager: JhiEventManager,
                private translateService: TranslateService,
                private configService: XmConfigService) {
    }

    ngOnInit() {
        this.getLinkSpecConfig().subscribe(res => this.linkSpecQuery = res || null);
        this.onSearch();
    }

    getLinkSpecConfig() {
       return this.configService.getUiConfig().pipe(
           map(res => res.applications.config.entities.find(entity => entity.typeKey === this.sourceXmEntity.typeKey) || {}),
           filter(entity => entity.hasOwnProperty('links')),
           map(entity => entity.links.find(link => link.key === this.linkSpec.key)['filterQuery'])
        );
    }

    onSearch() {
        this.searchXmEntities = [];
        this.page = 0;
        this.load();
    }

    onShowMore() {
        this.page++;
        this.load();
    }

    load() {
        this.showLoader = true;
        this.xmEntityService.search({
            query: `(typeKey:${this.linkSpec.typeKey}* OR typeKey:${this.linkSpec.typeKey})`
                + (this.linkSpecQuery ? ` AND ${this.linkSpecQuery}` : '')
                + (this.searchQuery ? ` AND ${this.searchQuery}` : ''),
            size: 5,
            page: this.page
        }).subscribe((xmEntities: HttpResponse<XmEntity[]>) => {
                this.total = parseInt(xmEntities.headers.get('X-Total-Count'), 10);
                this.searchXmEntities.push(...xmEntities.body);
            },
            (err) => console.log(err),
            () => this.showLoader = false);
    }

    onCancel() {
        this.activeModal.dismiss('cancel');
    }

    onAdd(targetXmEntity: XmEntity) {
        this.showLoader = true;
        const link = new Link();
        link.target = targetXmEntity;
        link.source = this.sourceXmEntity;
        link.typeKey = this.linkSpec.key;
        link.startDate = new Date().toISOString();

        this.linkService.create(link).subscribe(() => {
                this.eventManager.broadcast({name: 'linkListModification'});
                this.alert('success', 'xm-entity.link-detail-dialog.add.success');
            }, () => {this.alert('error', 'xm-entity.link-detail-dialog.add.error'); this.showLoader = false},
            () => this.activeModal.dismiss(true));
    }

    private alert(type, key) {
        swal({
            type: type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary'
        });
    }

}
