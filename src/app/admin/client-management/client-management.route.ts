import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { ClientMgmtComponent } from './client-management.component';

@Injectable()
export class ClientResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'lastModifiedDate,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort),
        };
    }
}

export const clientMgmtRoute: Routes = [
    {
        path: 'client-management',
        children: [
            {
                path: '',
                component: ClientMgmtComponent,
                resolve: {
                    pagingParams: ClientResolvePagingParams,
                },
                data: {
                    privileges: {value: ['CLIENT.GET_LIST']},
                    pageTitle: 'global.menu.admin.main',
                    pageSubTitleTrans: 'global.menu.admin.clientManagement',
                },
            },
        ],
    },
];
