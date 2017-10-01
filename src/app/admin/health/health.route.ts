import { Route } from '@angular/router';
import { JhiHealthCheckComponent } from './health.component';

export const healthRoute: Route = {
  path: 'health',
  component: JhiHealthCheckComponent,
  data: {
    pageTitle: 'global.menu.admin.main',
    pageSubTitleTrans: 'global.menu.admin.health'
  }
};
