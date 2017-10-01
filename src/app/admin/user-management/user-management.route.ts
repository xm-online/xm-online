import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { PaginationUtil } from 'ng-jhipster';

import { UserMgmtComponent } from './user-management.component';
import { UserMgmtDetailComponent } from './user-management-detail.component';
import { UserDialogComponent } from './user-management-dialog.component';
import { UserDeleteDialogComponent } from './user-management-delete-dialog.component';

import { Principal } from '../../shared';
import {UserLoginDialogComponent} from "./user-login-management-dialog.component";

@Injectable()
export class UserResolve implements CanActivate {

  constructor(private principal: Principal) { }

  canActivate() {
    return this.principal.identity().then((account) => this.principal.hasAnyAuthority(['ROLE_ADMIN']));
  }
}

@Injectable()
export class UserResolvePagingParams implements Resolve<any> {

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

export const userMgmtRoute: Routes = [
  {
    path: 'user-management',
    component: UserMgmtComponent,
    resolve: {
      'pagingParams': UserResolvePagingParams
    },
    data: {
      pageTitle: 'global.menu.admin.main',
      pageSubTitleTrans: 'global.menu.admin.userManagement'
    }
  },
  {
    path: 'user-management/:userKey',
    component: UserMgmtDetailComponent,
    data: {
      pageTitle: 'global.menu.admin.main',
      pageSubTitleTrans: 'userManagement.detail.title'
    }
  }
];

export const userDialogRoute: Routes = [
  {
    path: 'user-management-new',
    component: UserDialogComponent,
    outlet: 'popup'
  },
  {
    path: 'user-management/:userKey/edit',
    component: UserDialogComponent,
    outlet: 'popup'
  },
  {
    path: 'user-management/:userKey/delete',
    component: UserDeleteDialogComponent,
    outlet: 'popup'
  },
  {
    path: 'user-login-management/:userKey/edit',
    component: UserLoginDialogComponent,
    outlet: 'popup'
  }
];
