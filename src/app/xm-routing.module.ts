import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { errorRoute } from './layouts';
import { navbarRoute } from './layouts/navbar/navbar.route';

const ROUTES: Routes = [
    navbarRoute,
    ...errorRoute,
    {path: 'administration', loadChildren: './admin/admin.module#XmAdminModule'},
    {path: 'configuration', loadChildren: './admin-config/admin-config.module#XmAdminConfigModule'},
    {path: '', loadChildren: './home/home.module#GateHomeModule'},
    {path: '', loadChildren: './account/account.module#GateAccountModule'},
    {path: '', loadChildren: './application/application.module#ApplicationModule'},
    {path: '', loadChildren: './xm-dashboard/xm-dashboard.module#XmDashboardModule'},
];

@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES, {useHash: false, enableTracing: !environment.production}),
    ],
    exports: [RouterModule],
})
export class XmRoutingModule {
}
