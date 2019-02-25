import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {ITEMS_PER_PAGE} from '../shared/constants/pagination.constants';
import {ActivatedRoute, Router} from '@angular/router';
import {JhiAlertService, JhiEventManager, JhiParseLinks} from 'ng-jhipster';
import {Subscription} from 'rxjs';
import swal from 'sweetalert2';

@Injectable()
export class BaseAdminListComponent implements OnInit, OnDestroy{

    list: any[];
    page: any;
    previousPage: any;
    reverse: any;
    predicate: any;
    itemsPerPage: any;
    links: any;
    totalItems: any;
    queryCount: any;
    eventModify: string;
    navigateUrl: string;
    basePredicate: string;
    showLoader: boolean;
    private routeData: Subscription;
    private eventModifySubscriber: Subscription;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected alertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected parseLinks: JhiParseLinks,
        protected router: Router
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.itemsPerPage = data['pagingParams'].size;
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
    }

    ngOnInit() {
        this.loadAll();
        this.registerChangeInList();
    }

    ngOnDestroy() {
        this.routeData.unsubscribe();
        this.eventManager.destroy(this.eventModifySubscriber);
    }

    loadAll() { }

    deleteAction(id: number) { }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== this.basePredicate) {
            result.push(this.basePredicate);
        }
        return result;
    }

    transition() {
        this.router.navigate([this.navigateUrl], { queryParams:
            {
              size: this.itemsPerPage,
              page: this.page,
              sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    registerChangeInList() {
        this.eventModifySubscriber = this.eventManager.subscribe(this.eventModify, (result) => {
            this.page = this.getPageAfterRemove(result);
            this.loadAll();
        });
    }

    onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        return data;
    }

    onError(error) {
        this.alertService.error(error.error, error.message, null);
    }

    protected onDeleteItem(id: number, itemName: string) {
        swal({
            title: `Delete ${itemName}?`,
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-raised-button btn-primary',
            cancelButtonClass: 'btn mat-raised-button',
            confirmButtonText: 'Yes, delete!'
        }).then((result) => result.value  ? this.deleteAction(id)
            : console.log('Cancel'));
    }

    protected getPageAfterRemove(result) {
        if (result && result.content && result.content.id === 'delete' && this.page > 1) {
            this.queryCount--;
            const length = parseInt(this.queryCount / this.itemsPerPage + '', 10) + (this.queryCount % this.itemsPerPage ? 1 : 0);
            if (this.page > length) {
                this.previousPage = null;
                return length;
            }
            return this.page;
        } else {
           return this.page;
        }
    }

}
