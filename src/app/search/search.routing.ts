import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { PaginationUtil } from 'ng-jhipster';
import {SearchComponent} from "./search.component";


@Injectable()
export class SearchResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: PaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
        };
    }
}

export const searchRoute: Routes = [
    {
        path: 'search',
        component: SearchComponent,
        resolve: {
            'pagingParams': SearchResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'xm.xmEntity.search'
        },
        canActivate: [UserRouteAccessService]
    }
];