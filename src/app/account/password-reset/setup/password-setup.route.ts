import { Route } from '@angular/router';

import { UserRouteAccessService } from '../../../shared/index';
import { PasswordResetFinishComponent } from '../finish/password-reset-finish.component';

export const passwordSetupRoute: Route = {
  path: 'password/setup',
  component: PasswordResetFinishComponent,
  data: {
    config: {
        formTitle: 'reset.setup.title',
        formMessageInfo: 'reset.setup.messages.info',
        formMessageError: 'reset.setup.messages.error',
        formMessageSuccess: 'reset.setup.messages.success',
        formButtonLabel: 'reset.setup.form.button',
    },
    authorities: [],
    pageTitle: 'global.menu.account.passwordSetup'
  },
  canActivate: [UserRouteAccessService]
};
