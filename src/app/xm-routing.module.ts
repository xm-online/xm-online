import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts';
import { DEBUG_INFO_ENABLED } from './xm.constants';
import { navbarRoute } from './xm.route';

const LAYOUT_ROUTES = [navbarRoute, ...errorRoute];

@NgModule({
    imports: [
        RouterModule.forRoot([
                ...LAYOUT_ROUTES,
                {
                    path: 'administration',
                    loadChildren: './admin/admin.module#XmAdminModule'
                },
                {
                    path: 'configuration',
                    loadChildren: './admin-config/admin-config.module#XmAdminConfigModule'
                }
            ],
            {useHash: false, enableTracing: DEBUG_INFO_ENABLED}
        )
    ],
    exports: [RouterModule]
})
export class XmRoutingModule {
}
