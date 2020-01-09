import { Route } from '@angular/router';

import { LogoutComponent } from './logout.component';

export const logoutRoute: Route = {
    path: 'logout',
    component: LogoutComponent,
    data: {
        pageTitle: 'global.menu.account.logout',
    },
};
