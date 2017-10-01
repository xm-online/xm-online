import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
    AuditsComponent,
    UserMgmtComponent,
    UserDialogComponent,
    UserDeleteDialogComponent,
    UserLoginDialogComponent,
    UserLoginMgmtDialogComponent,
    UserMgmtDetailComponent,
    UserMgmtDialogComponent,
    UserMgmtDeleteDialogComponent,
    LogsComponent,
    JhiMetricsMonitoringModalComponent,
    JhiMetricsMonitoringComponent,
    JhiHealthModalComponent,
    JhiHealthCheckComponent,
    JhiDocsComponent,
    AuditsService,
    JhiHealthService,
    JhiMetricsService,
    GatewayRoutesService,
    JhiGatewayComponent,
    LogsService,
    UserResolvePagingParams,
    UserResolve,
    UserModalService
} from './';
import {adminState} from "./admin.route";
import {FormPlaygroundComponent} from './form-playground/form-playground.component';
import {AceEditorDirective} from './form-playground/ace-editor.directive';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {JsonSchemaFormModule} from 'angular2-json-schema-form';
import {ConfigurationComponent} from './configuration/configuration.component';
import {XmConfigService} from './configuration/config.service';
import {TranslationComponent} from './translations/translation.component';
import {TranslationService} from './translations/translation.service';
import {GateSharedModule} from "../shared/shared.module";

@NgModule({
    imports: [
        GateSharedModule, JsonSchemaFormModule,
        BrowserModule,
        FormsModule, HttpModule,
        RouterModule.forRoot(adminState, { useHash: true })
    ],
    declarations: [
        AceEditorDirective,
        AuditsComponent,
        UserMgmtComponent,
        UserDialogComponent,
        UserDeleteDialogComponent,
        UserLoginDialogComponent,
        UserLoginMgmtDialogComponent,
        UserMgmtDetailComponent,
        UserMgmtDialogComponent,
        UserMgmtDeleteDialogComponent,
        LogsComponent,
        JhiHealthCheckComponent,
        JhiHealthModalComponent,
        FormPlaygroundComponent,
        ConfigurationComponent,
        TranslationComponent,
        JhiDocsComponent,
        JhiGatewayComponent,
        JhiMetricsMonitoringComponent,
        JhiMetricsMonitoringModalComponent
    ],
    entryComponents: [
        UserLoginMgmtDialogComponent,
        UserMgmtDialogComponent,
        UserMgmtDeleteDialogComponent,
        JhiHealthModalComponent,
        JhiMetricsMonitoringModalComponent,
    ],
    providers: [
        AuditsService,
        JhiHealthService,
        JhiMetricsService,
        GatewayRoutesService,
        LogsService,
        UserResolvePagingParams,
        UserResolve,
        UserModalService,
        XmConfigService,
        TranslationService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateAdminModule {}
