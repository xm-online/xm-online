import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { dashboardMngRoute } from './dashboard-mng/dashboard-mng.route';
import { specificationMngRoute } from './specification-mng/specification-mng.route';

const ADMIN_CONFIG_ROUTES = [
    ...dashboardMngRoute,
    ...specificationMngRoute
];

export const adminConfigState: Routes = [{
    path: '',
    data: {
        authorities: ['ROLE_ADMIN']
    },
    canActivateChild: [UserRouteAccessService],
    children: ADMIN_CONFIG_ROUTES
}
];
