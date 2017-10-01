import {Route} from '@angular/router';
import {ConfigurationComponent} from './configuration.component';

export const configurationRoute: Route = {
    path: 'configuration',
    component: ConfigurationComponent,
    data: {
        pageTitle: 'global.menu.admin.main',
        pageSubTitleTrans: 'global.menu.admin.tenantConfiguration'
    }
};
