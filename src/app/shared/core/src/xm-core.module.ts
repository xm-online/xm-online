import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { defaults } from 'lodash';
import { JhiEventManager } from 'ng-jhipster';
import { XmPermissionService } from '../../privilege/xm-permission.service';
import { XM_CORE_CONFIG_DEFAULT, XM_CORE_EXTERNAL_CONFIG, XmCoreConfig } from './xm-core-config';
import { XmEventManagerService } from './xm-event-manager.service';

import { XmSessionService } from './xm-session.service';
import { XmUiConfigService } from './config/xm-ui-config.service';
import { XmUserService } from './xm-user.service';

export function xmCoreConfigFactory(externalConfig?: XmCoreConfig): XmCoreConfig {
    return externalConfig ? defaults(externalConfig, XM_CORE_CONFIG_DEFAULT) : XM_CORE_CONFIG_DEFAULT;
}

@NgModule({
    imports: [CommonModule],
})
export class XmCoreModule {
    public static forRoot(externalConfig?: XmCoreConfig): ModuleWithProviders {
        return {
            ngModule: XmCoreModule,
            providers: [
                XmEventManagerService,
                {provide: JhiEventManager, useExisting: XmEventManagerService},
                XmSessionService,
                XmUiConfigService,
                XmUserService,
                XmPermissionService,
                {provide: XM_CORE_EXTERNAL_CONFIG, useValue: externalConfig},
                {provide: XmCoreConfig, useFactory: xmCoreConfigFactory, deps: [XM_CORE_EXTERNAL_CONFIG]},
            ],
        };
    }

}
