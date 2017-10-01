import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { ITEMS_PER_PAGE, Principal } from '../shared';
import { PaginationConfig } from '../blocks/config/uib-pagination.config';
import { XmEntity } from '../entities/xm-entity/xm-entity.model';
import { XmEntityService } from '../entities/xm-entity/xm-entity.service';
import { XmEntitySpecService } from '../shared/spec/spec.service';

import swal from 'sweetalert2';
import {JhiLanguageHelper} from '../shared/language/language.helper';
import {I18nNamePipe} from "../shared/language/i18n-name.pipe";

@Component({
    selector: 'xm-entity',
    templateUrl: './application.component.html'
})
export class ApplicationComponent implements OnInit, OnDestroy {

    currentAccount: any;
    xmEntities: XmEntity[];
    error: any;
    success: any;
    private routeData: any;
    private eventSubscriber: Subscription;
    private routeDataSubscription: Subscription;
    private routeParamsSubscription: Subscription;
    currentSearch: string;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    typeKey: string;
    entityType: any;
    types: any;

    constructor(
        private jhiLanguageHelper: JhiLanguageHelper,
        private jhiLanguageService: JhiLanguageService,
        private xmEntityService: XmEntityService,
        private xmEntitySpecService: XmEntitySpecService,
        private parseLinks: ParseLinks,
        private alertService: AlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: EventManager,
        private i18nNamePipe: I18nNamePipe,
    ) {
        this.jhiLanguageService.addLocation('xmEntity');
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }

    ngOnInit() {
        this.routeDataSubscription = this.activatedRoute.data.subscribe((data) => {
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
            if (this.routeData) {
              Object.assign(data, this.routeData);
            } else {
                this.routeData = data;
            }
        });
        this.routeParamsSubscription = this.activatedRoute.params.subscribe((params) => {
            if ( params['key'] ) {
                this.typeKey = params['key'];
                this.xmEntitySpecService.getEntityType()
                    .then(result => {
                        this.entityType = this.getType(this.typeKey);
                        this.currentSearch = null;
                        this.loadAll();

                        if (this.entityType && this.entityType.name) {
                            this.routeData.pageSubTitle = this.i18nNamePipe.transform(this.entityType.name, this.principal);
                            this.jhiLanguageHelper.updateTitle();
                        }
                    });
            }
        });

        // this.loadAll();  Duplicated call in constructor. Load after change routeParam
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInXmEntities();
    }

    loadAll() {
        if (this.currentSearch) {
            this.xmEntityService.search({
                typeKey: this.typeKey,
                query: this.currentSearch,
                size: this.itemsPerPage,
                sort: this.sort()}).subscribe(
                    (res: Response) => this.onSuccess(res.json(), res.headers),
                    (res: Response) => this.onError(res.json())
                );
            return;
        }
        this.xmEntityService.query({
            typeKey: this.typeKey,
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()}).subscribe(
            (res: Response) => this.onSuccess(res.json(), res.headers),
            (res: Response) => this.onError(res.json())
        );
    }
    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate([`/application`, this.typeKey], {queryParams:
            {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate(['/application/:key', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }
    search(query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.currentSearch = query;
        this.router.navigate(['/application/:key', {
            search: this.currentSearch,
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }

    generateXmEntity(typeKey: string) {
        this.xmEntitySpecService.generateXmEntity({ 'typeKey': typeKey }).toPromise().then(value => {
            this.loadAll();
            swal({
                title: 'New entity "' + value.json().name + '" generated!',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-success'
            });
        });
    }

    getShortDescription(xmEntity) {
        if (xmEntity.description && xmEntity.description.length > 30) {
           return xmEntity.description.substr(0, 29) + '...';
        }
        return xmEntity.description;
    }

    ngOnDestroy() {
        this.routeParamsSubscription.unsubscribe();
        this.routeDataSubscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: XmEntity) {
        return item.id;
    }
    registerChangeInXmEntities() {
        this.eventSubscriber = this.eventManager.subscribe('xmEntityListModification', (response) => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.xmEntities = data.map(el => {
            el.state = this.getState(el.typeKey, el.stateKey);
            el.entityType = this.entityType && this.entityType.key == el.typeKey ? this.entityType : this.getType(el.typeKey);
            return el;
        });
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    getState(typeKey: string, stateKey: string) {
        return this.xmEntitySpecService.getState(typeKey, stateKey);
    }

    getType(typeKey: string) {
        return this.xmEntitySpecService.getType(typeKey);
    }

    getFastSearches(typeKey: string) {
        return this.xmEntitySpecService.getFastSearch(typeKey);
    }

    applyFastSearch(query: string) {
        this.currentSearch = query;
        this.loadAll();
    }
}
