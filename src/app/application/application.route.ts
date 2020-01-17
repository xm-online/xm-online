import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { ITEMS_PER_PAGE, UserRouteAccessService } from '../shared';
import { ApplicationComponent } from './application.component';
import { EntityDetailComponent } from './entity-detail.component';

export interface IApplicationResolvePagingParams { predicate: string; size: number; page: number; ascending: boolean }

@Injectable()
export class ApplicationResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {
    }

    public resolve(route: ActivatedRouteSnapshot): IApplicationResolvePagingParams {
        const page = route.queryParams.page ? route.queryParams.page : '1';
        const sort = route.queryParams.sort ? route.queryParams.sort : 'id,asc';
        const size = route.queryParams.size && parseInt(route.queryParams.size, 10) || ITEMS_PER_PAGE;
        return {
            size,
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort),
        };
    }
}

export const applicationRoute: Routes = [
    {
        path: 'application/:key',
        component: ApplicationComponent,
        resolve: {
            pagingParams: ApplicationResolvePagingParams,
        },
        data: {
            authorities: ['ROLE_USER'],
            privileges: {
                condition: 'AND',
                value: ['XMENTITY_SPEC.GET', 'XMENTITY.GET_LIST'],
            },
            pageTitle: 'global.menu.applications.application',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'application/:key/:id',
        component: EntityDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'global.menu.applications.application',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'search',
        component: ApplicationComponent,
        resolve: {
            pagingParams: ApplicationResolvePagingParams,
        },
        data: {
            authorities: ['ROLE_USER'],
            privileges: {
                value: ['XMENTITY.SEARCH', 'XMENTITY.SEARCH.QUERY'],
            },
            pageTitle: 'xm.xmEntity.search',
        },
        canActivate: [UserRouteAccessService],
    },
];
