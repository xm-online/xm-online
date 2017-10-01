import { Route } from '@angular/router';

import { FormPlaygroundComponent } from './form-playground.component';

export const formPlaygroundRoute: Route = {
  path: 'form-playground',
  component: FormPlaygroundComponent,
  data: {
    pageTitle: 'global.menu.admin.main',
    pageSubTitleTrans: 'global.menu.admin.formPlayground'
  }
};
