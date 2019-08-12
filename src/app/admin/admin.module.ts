import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
    Framework,
    FrameworkLibraryService,
    JsonSchemaFormModule,
    JsonSchemaFormService,
    MaterialDesignFramework, MaterialDesignFrameworkModule,
    WidgetLibraryService,
} from 'angular2-json-schema-form';

import { JhiLanguageHelper } from '../shared';
import { ModulesLanguageHelper } from '../shared/language/modules-language.helper';
import { XmSharedModule } from '../shared/shared.module';

import { TagInputModule } from 'ngx-chips';
import {
    AuditsComponent,
    AuditsService,
    BaseAdminListComponent,
    ClientMgmtComponent,
    ClientMgmtDeleteDialogComponent,
    ClientMgmtDialogComponent,
    ClientResolvePagingParams,
    GatewayRoutesService,
    JhiDocsComponent,
    JhiGatewayComponent,
    JhiHealthCheckComponent,
    JhiHealthModalComponent,
    JhiHealthService,
    JhiMetricsMonitoringComponent,
    JhiMetricsMonitoringModalComponent,
    JhiMetricsService,
    LogsComponent,
    LogsService,
    RoleConditionDialogComponent,
    RoleMgmtDeleteDialogComponent,
    RoleMgmtDetailComponent,
    RoleMgmtDialogComponent,
    RolesMatrixComponent,
    RolesMgmtComponent,
    RolesResolve,
    UserLoginMgmtDialogComponent,
    UserMgmtComponent,
    UserMgmtDeleteDialogComponent,
    UserMgmtDetailComponent,
    UserMgmtDialogComponent,
    UserModalService,
    UserResolve,
    UserResolvePagingParams,
} from './';
import { XmConfigService } from './../shared/spec/config.service';
import { adminState } from './admin.route';
import { FormPlaygroundComponent } from './form-playground/form-playground.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { TranslationComponent } from './translations/translation.component';
import { TranslationService } from './translations/translation.service';

@NgModule({
    imports: [
        CommonModule,
        TagInputModule,
        XmSharedModule,
        MaterialDesignFrameworkModule,
        {
            ngModule: JsonSchemaFormModule,
            providers: [
                JsonSchemaFormService,
                FrameworkLibraryService,
                WidgetLibraryService,
                {provide: Framework, useClass: MaterialDesignFramework, multi: true},
            ],
        },
        FormsModule,
        RouterModule.forChild(adminState),
    ],
    declarations: [
        AuditsComponent,
        RolesMgmtComponent,
        RoleMgmtDetailComponent,
        RoleMgmtDialogComponent,
        RoleMgmtDeleteDialogComponent,
        RoleConditionDialogComponent,
        RolesMatrixComponent,
        ClientMgmtComponent,
        ClientMgmtDialogComponent,
        ClientMgmtDeleteDialogComponent,
        UserMgmtComponent,
        UserLoginMgmtDialogComponent,
        UserMgmtDetailComponent,
        UserMgmtDialogComponent,
        UserMgmtDeleteDialogComponent,
        LogsComponent,
        JhiHealthCheckComponent,
        JhiHealthModalComponent,
        FormPlaygroundComponent,
        MaintenanceComponent,
        TranslationComponent,
        JhiDocsComponent,
        JhiGatewayComponent,
        JhiMetricsMonitoringComponent,
        JhiMetricsMonitoringModalComponent,
    ],
    entryComponents: [
        RoleMgmtDialogComponent,
        RoleMgmtDeleteDialogComponent,
        RoleConditionDialogComponent,
        UserLoginMgmtDialogComponent,
        UserMgmtDialogComponent,
        UserMgmtDeleteDialogComponent,
        ClientMgmtDialogComponent,
        ClientMgmtDeleteDialogComponent,
        JhiHealthModalComponent,
        JhiMetricsMonitoringModalComponent,
    ],
    providers: [
        BaseAdminListComponent,
        AuditsService,
        JhiHealthService,
        JhiMetricsService,
        GatewayRoutesService,
        LogsService,
        RolesResolve,
        UserResolvePagingParams,
        UserResolve,
        UserModalService,
        ClientResolvePagingParams,
        XmConfigService,
        TranslationService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class XmAdminModule {
    constructor(private modulesLangHelper: ModulesLanguageHelper, private languageHelper: JhiLanguageHelper) {
        this.languageHelper
            .language
            .subscribe((languageKey: string) => {this.modulesLangHelper.correctLang(languageKey); });
    }
}
