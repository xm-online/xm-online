import {Route} from '@angular/router';
import {TranslationComponent} from './translation.component';

export const translationRoute: Route = {
    path: 'translation',
    component: TranslationComponent,
    data: {
        pageTitle: 'global.menu.admin.main',
        pageSubTitleTrans: 'global.menu.admin.translation'
    }
};
