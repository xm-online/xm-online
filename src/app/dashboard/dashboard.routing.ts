import { Routes } from '@angular/router';

import { DashboardsComponent } from './dashboards.component';
import { DashboardComponent } from './dashboard.component';
import {UserRouteAccessService} from "../shared/auth/user-route-access-service";

export const DashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardsComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'xm.dashboard.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'dashboard/:id',
    component: DashboardComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'xm.dashboard.detail.title'
    },
    canActivate: [UserRouteAccessService]
  }
];