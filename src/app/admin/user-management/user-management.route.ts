import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { UserMgmtDetailComponent } from './user-management-detail.component';
import { UserMgmtComponent } from './user-management.component';

@Injectable()
export class UserResolve implements CanActivate {

    constructor(private principal: Principal) {
    }

    canActivate() {
        return this.principal.identity().then((account) => this.principal.hasAnyAuthority(['ROLE_ADMIN']));
    }
}

@Injectable()
export class UserResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        const size = route.queryParams.size && parseInt(route.queryParams.size, 10) || ITEMS_PER_PAGE;
        return {
            size: size,
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort),
        };
    }
}

export const userMgmtRoute: Routes = [
    {
        path: 'user-management',
        children: [
            {
                path: '',
                component: UserMgmtComponent,
                resolve: {
                    'pagingParams': UserResolvePagingParams
                },
                data: {
                    privileges: {value: ['USER.GET_LIST']},
                    pageTitle: 'global.menu.admin.main',
                    pageSubTitleTrans: 'global.menu.admin.userManagement'
                }
            },
            {
                path: 'user-management/:userKey',
                component: UserMgmtDetailComponent,
                data: {
                    privileges: {value: ['USER.GET_LIST']},
                    pageTitle: 'global.menu.admin.main',
                    pageSubTitleTrans: 'userManagement.detail.title'
                }
            }
        ]
    }
];
