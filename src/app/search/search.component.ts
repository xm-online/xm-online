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
import {JhiLanguageHelper} from "../shared/language/language.helper";

@Component({
    selector: 'search',
    templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, OnDestroy {

    currentAccount: any;
    xmEntities: XmEntity[];
    error: any;
    success: any;
    private eventSubscriber: Subscription;
    private routeDataSubscription: Subscription;
    private routeParamsSubscription: Subscription;
    currentSearch: string;
    private routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
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
        private paginationUtil: PaginationUtil,
        private paginationConfig: PaginationConfig
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.jhiLanguageService.addLocation('xmEntity');
    }

    ngOnInit() {
        this.routeDataSubscription = this.activatedRoute.data.subscribe((data) => {
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
            this.routeData = data;
        });
        this.routeParamsSubscription = this.activatedRoute.queryParams.subscribe((params) => {
            if (params['query'] ) {
                this.currentSearch = params['query'];
                this.loadAll();

                this.routeData.pageSubTitle = `[${params['query']}]`;
                this.jhiLanguageHelper.updateTitle();
            }
        });

        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInXmEntities();
    }

    loadAll() {
        if (this.currentSearch) {
            this.xmEntityService.search({
                query: this.currentSearch,
                size: this.itemsPerPage,
                sort: this.sort()}).subscribe(
                (res: Response) => this.onSuccess(res.json(), res.headers),
                (res: Response) => this.onError(res.json())
            );
            return;
        }
        this.xmEntityService.search({
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
        this.router.navigate(['/application/:key'], {queryParams:
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
    }

    ngOnDestroy() {
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
        this.xmEntities = data;
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
}
