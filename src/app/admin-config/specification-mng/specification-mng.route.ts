import { Routes } from '@angular/router';
import { SpecificationMngComponent } from './specification-mng.component';

export const specificationMngRoute: Routes = [
    {
        path: 'specification-management',
        children: [
            {
                path: ':slug',
                component: SpecificationMngComponent,
                data: {
                    privileges: {value: ['CONFIG.CLIENT.GET_LIST.ITEM']},
                    pageTitle: 'admin-config.common.menu.title',
                    pageSubTitleTrans: 'admin-config.common.menu.specification-mng'
                }
            }
        ]
    }
];
