import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { PaginationUtil } from 'ng-jhipster';

import { ApplicationComponent } from './application.component';
import { EntityDeletePopupComponent } from './entity-delete-dialog.component';
import { EntityPopupComponent } from './entity-dialog.component';
import { EntityDetailComponent } from './entity-detail.component';

@Injectable()
export class ApplicationResolvePagingParams implements Resolve<any> {

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

export const applicationRoute: Routes = [
    {
        path: 'application/:key',
        component: ApplicationComponent,
        resolve: {
            'pagingParams': ApplicationResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'global.menu.applications.application'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'application/:key/:id',
        component: EntityDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'global.menu.applications.application'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const entityPopupRoute: Routes = [
    {
        path: 'application/:key/entity-new',
        component: EntityPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'xm.xmEntity.detail.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'application/:key/:id/edit',
        component: EntityPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'xm.xmEntity.detail.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'application/:key/:id/delete',
        component: EntityDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'xm.xmEntity.detail.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
