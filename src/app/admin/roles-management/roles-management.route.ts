import { Injectable } from '@angular/core';
import { CanActivate, Routes } from '@angular/router';

import { Principal } from '../../shared';
import { RoleMgmtDetailComponent } from './roles-management-detail.component';
import { RolesMgmtComponent } from './roles-management.component';

@Injectable()
export class RolesResolve implements CanActivate {

    constructor(private principal: Principal) {
    }

    canActivate() {
        return this.principal.identity().then((account) => this.principal.hasAnyAuthority(['ROLE_ADMIN']));
    }
}

export const rolesMgmtRoute: Routes = [
    {
        path: 'roles-management',
        children: [
            {
                path: '',
                component: RolesMgmtComponent,
                data: {
                    privileges: {value: ['ROLE.GET_LIST']},
                    pageTitle: 'global.menu.admin.main',
                    pageSubTitleTrans: 'global.menu.admin.rolesManagement'
                }
            },
            {
                path: 'role-management/:roleKey',
                component: RoleMgmtDetailComponent,
                data: {
                    privileges: {value: ['ROLE.GET_LIST']},
                    pageTitle: 'global.menu.admin.main',
                    pageSubTitleTrans: 'rolesManagement.detail.title'
                }
            }
        ]
    }
];
