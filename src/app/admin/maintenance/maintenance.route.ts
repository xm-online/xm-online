import { Route } from '@angular/router';
import { MaintenanceComponent } from './maintenance.component';

export const maintenanceRoute: Route = {
    path: 'maintenance',
    component: MaintenanceComponent,
    data: {
        privileges: {value: ['']},
        pageTitle: 'global.menu.admin.main',
        pageSubTitleTrans: 'global.menu.admin.maintenance'
    }
};
