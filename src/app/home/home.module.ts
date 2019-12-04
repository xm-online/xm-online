import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageHelper, ModulesLanguageHelper } from '../shared';

import { XmSharedModule } from '../shared/shared.module';
import { XmDashboardModule } from '../xm-dashboard/xm-dashboard.module';
import { HomeComponent } from './';
import { HOME_ROUTE } from './home.route';

@NgModule({
    imports: [
        XmSharedModule,
        RouterModule.forChild([HOME_ROUTE]),
        XmDashboardModule,
    ],
    declarations: [
        HomeComponent,
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GateHomeModule {
    constructor(private modulesLangHelper: ModulesLanguageHelper, private languageHelper: JhiLanguageHelper) {
        this.languageHelper
            .language
            .subscribe((languageKey: string) => {this.modulesLangHelper.correctLang(languageKey); });
    }
}
