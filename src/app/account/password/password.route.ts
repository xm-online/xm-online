import { Route } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PasswordComponent } from './password.component';

export const passwordRoute: Route = {
    path: 'password',
    component: PasswordComponent,
    data: {
        privileges: {value: ['ACCOUNT.PASSWORD.UPDATE']},
        pageTitle: 'global.menu.account.password',
    },
    canActivate: [UserRouteAccessService],
};
