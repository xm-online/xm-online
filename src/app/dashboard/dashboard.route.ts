import { Route } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import {DashboardComponent} from "./dashboard.component";

export const dashboardRoute: Route = {
  path: 'dashboard',
  component: DashboardComponent,
  data: {
    authorities: [],
    pageTitle: 'dashboard.title'
  },
  canActivate: [UserRouteAccessService]
};
