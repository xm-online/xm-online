import { Route } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { SignUpComponent } from './sign-up.component';

export const registerRoute: Route = {
    path: 'sign-up',
    component: SignUpComponent,
    data: {
        authorities: [],
        pageTitle: 'register.title',
    },
    canActivate: [UserRouteAccessService],
};
