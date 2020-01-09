import { Routes } from '@angular/router';

import {
    activateRoute,
    passwordResetFinishRoute,
    passwordResetInitRoute,
    passwordRoute,
    passwordSetupRoute,
    registerRoute,
    settingsRoute,
    socialAuthRoute,
    socialRegisterRoute,
} from './';
import { logoutRoute } from './logout/logout.route';

export const accountState: Routes = [{
    path: '',
    children: [
        activateRoute,
        passwordRoute,
        passwordResetFinishRoute,
        passwordSetupRoute,
        passwordResetInitRoute,
        registerRoute,
        socialAuthRoute,
        socialRegisterRoute,
        settingsRoute,
        logoutRoute,
    ],
}];
