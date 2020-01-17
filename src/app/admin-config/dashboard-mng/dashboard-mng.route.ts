import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { DashboardListCardComponent } from './dashboard-list-card/dashboard-list-card.component';
import { WidgetListCardComponent } from './widget-list-card/widget-list-card.component';

@Injectable()
export class DashboardResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {
    }

    public resolve(route: ActivatedRouteSnapshot): any {
        const page = route.queryParams.page ? route.queryParams.page : '1';
        const sort = route.queryParams.sort ? route.queryParams.sort : 'id,asc';
        const size = route.queryParams.size ? route.queryParams.size : '10';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort),
            size,
        };
    }
}

export const dashboardMngRoute: Routes = [
    {
        path: 'dashboard-management',
        children: [
            {
                path: '',
                component: DashboardListCardComponent,
                resolve: {
                    pagingParams: DashboardResolvePagingParams,
                },
                data: {
                    privileges: {value: ['DASHBOARD.GET_LIST']},
                    pageTitle: 'admin-config.common.menu.title',
                    pageSubTitleTrans: 'admin-config.common.menu.dashboard-mng',
                },
            },
            {
                path: ':id',
                component: WidgetListCardComponent,
                resolve: {
                    pagingParams: DashboardResolvePagingParams,
                },
                data: {
                    privileges: {value: ['WIDGET.GET_LIST']},
                    pageTitle: 'admin-config.common.menu.title',
                    pageSubTitleTrans: 'admin-config.common.menu.dashboard-mng',
                },
            },
        ],
    },
];
