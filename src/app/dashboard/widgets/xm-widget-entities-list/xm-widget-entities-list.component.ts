import {Component, Injector, OnInit} from '@angular/core';
import {JhiLanguageService} from "ng-jhipster";
import {XmEntitySpecService} from "../../../shared/spec/spec.service";
import {I18nNamePipe} from "app/shared";
import {Principal} from "../../../shared/auth/principal.service";
import {XmEntityService} from "../../../entities/xm-entity/xm-entity.service";
import {ITEMS_PER_PAGE} from "../../../shared";

@Component({
    selector: 'app-xm-widget-entities-list',
    templateUrl: './xm-widget-entities-list.component.html',
    styleUrls: ['./xm-widget-entities-list.component.css']
})
export class XmWidgetEntitiesListComponent implements OnInit {

    list: any[];
    activeId: number = 0;
    itemsPerPage: any;
    predicate: string = 'id';
    reverse: boolean;
    private config: any;
    private showLoader: boolean;

    constructor(
        private injector: Injector,
        private xmEntityService: XmEntityService,
        private jhiLanguageService: JhiLanguageService,
        private xmEntitySpecService: XmEntitySpecService,
        private principal: Principal,
    ) {
        this.jhiLanguageService.addLocation('xmEntity');
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.config = this.injector.get('config') || {};
        console.log('--------------- config', this.config);
    }


    ngOnInit() {
        if (this.config.entities) {
            this.xmEntitySpecService.getEntityType()
                .then(result => {
                    this.list = this.config.entities.map(el => {
                        el.page = 1;
                        el.entityType = this.xmEntitySpecService.getType(el.typeKey);
                        return el;
                    });
                    this.list.length && this.loadEntities(this.list[0]).subscribe(resp => this.list[0].entities = resp);
                    console.log('--------------- list', this.list);
                });
        }
    }

    setActiveTab(i: number) {
        this.activeId = i;
        let activeEntity = this.list[i];
        this.loadEntities(activeEntity).subscribe(result => activeEntity.entities = result);
    }

    onTransition(entity: any) {
        this.loadEntities(entity).subscribe(result => entity.entities = result);
    }

    onLoadPage(page: number, entity: any) {
        if (page !== entity.previousPage) {
            entity.previousPage = page;
            this.onTransition(entity);
        }
    }

    onApplyFastSearch(query: string, entity: any) {
        entity.currentSearch = query;
        this.loadEntities(entity).subscribe(result => entity.entities = result);
    }

    private loadEntities(entity) {
        this.showLoader = true;
        let options: any = {
            typeKey: entity.typeKey,
            page: entity.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()
        }, method = 'query';

        if (entity.currentSearch) {
            options.query = entity.currentSearch;
            method = 'search';
        }

        return this.xmEntityService[method](options).map(
            (resp) => {
                let list = resp.json();
                entity.totalItems = resp.headers.get('X-Total-Count');
                entity.queryCount = entity.totalItems;

                return list.map(el => {
                    el.state = this.xmEntitySpecService.getState(el.typeKey, el.stateKey);
                    el.description = this.getShortDescription(el.description);
                    return el;
                });
            }
        ).finally(() => this.showLoader = false);
    }

    private getShortDescription(desc: string = '') {
        return desc.length > 30 ? (desc.substr(0, 29).trim() + '...') : desc;
    }

    private sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        this.predicate == 'id' || result.push('id');
        return result;
    }

}
