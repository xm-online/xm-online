import { Routes } from '@angular/router';
import { RolesMatrixComponent } from './roles-matrix.component';

export const rolesMatrixRoute: Routes = [
    {
        path: 'roles-matrix',
        component: RolesMatrixComponent,
        data: {
            privileges: {value: ['ROLE.MATRIX.GET']},
            pageTitle: 'global.menu.admin.main',
            pageSubTitleTrans: 'global.menu.admin.rolesMatrix',
        },
    },
];
