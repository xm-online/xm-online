import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { errorRoute } from './layouts';
import { navbarRoute } from './layouts/navbar/navbar.route';

const ROUTES: Routes = [
    navbarRoute,
    ...errorRoute,
    {path: 'administration', loadChildren: () => import('./admin/admin.module').then((m) => m.XmAdminModule)},
    {
        path: 'configuration',
        loadChildren: () => import('./admin-config/admin-config.module').then((m) => m.XmAdminConfigModule),
    },
    {path: '', loadChildren: () => import('./home/home.module').then((m) => m.GateHomeModule)},
    {path: '', loadChildren: () => import('./account/account.module').then((m) => m.GateAccountModule)},
    {path: '', loadChildren: () => import('./application/application.module').then((m) => m.ApplicationModule)},
    {path: '', loadChildren: () => import('./xm-dashboard/xm-dashboard.module').then((m) => m.XmDashboardModule)},
];

@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES),
    ],
    exports: [RouterModule],
})
export class XmRoutingModule {
}
