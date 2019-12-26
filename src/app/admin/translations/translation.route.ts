import { Route } from '@angular/router';
import { TranslationComponent } from './translation.component';

export const translationRoute: Route = {
    path: 'translation',
    component: TranslationComponent,
    data: {
        privileges: {value: ['']},
        pageTitle: 'global.menu.admin.main',
        pageSubTitleTrans: 'global.menu.admin.translation',
    },
};
