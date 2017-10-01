import { Routes } from '@angular/router';

import {
    auditsRoute,
    docsRoute,
    healthRoute,
    logsRoute,
    metricsRoute,
    gatewayRoute,
    userMgmtRoute,
    userDialogRoute,
    configurationRoute,
    translationRoute,
    formPlaygroundRoute,
} from './';

import { UserRouteAccessService } from '../shared';

const ADMIN_ROUTES = [
    auditsRoute,
    docsRoute,
    healthRoute,
    formPlaygroundRoute,
    configurationRoute,
    translationRoute,
    logsRoute,
    gatewayRoute,
    ...userMgmtRoute,
    metricsRoute
];

export const adminState: Routes = [{
    path: 'administration',
    data: {
        authorities: ['ROLE_ADMIN']
    },
    canActivate: [UserRouteAccessService],
    children: ADMIN_ROUTES
},
    ...userDialogRoute
];
