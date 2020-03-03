import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { defaults } from 'lodash';
import { JhiEventManager } from 'ng-jhipster';
import { RequestCache } from './cache/request-cache';
import { XM_CORE_CONFIG, XM_CORE_CONFIG_DEFAULT, XM_CORE_EXTERNAL_CONFIG, XmCoreConfig } from './xm-core-config';
import { XmEventManagerService } from './xm-event-manager.service';

import { XmSessionService } from './xm-session.service';
import { XmUiConfigService } from './xm-ui-config.service';

export function xmCoreConfigFactory(externalConfig?: XmCoreConfig): XmCoreConfig {
    return externalConfig ? defaults(externalConfig, XM_CORE_CONFIG_DEFAULT) : XM_CORE_CONFIG_DEFAULT;
}

@NgModule({
    declarations: [],
    imports: [CommonModule],
})
export class XmCoreModule {

    constructor(xmUiConfigService: XmUiConfigService) {
        xmUiConfigService.init();
    }

    public static forRoot(externalConfig?: XmCoreConfig): ModuleWithProviders {
        return {
            ngModule: XmCoreModule,
            providers: [
                RequestCache,
                XmEventManagerService,
                {provide: JhiEventManager, useExisting: XmEventManagerService},
                XmSessionService,
                XmUiConfigService,
                {provide: XM_CORE_EXTERNAL_CONFIG, useValue: externalConfig},
                {provide: XM_CORE_CONFIG, useFactory: xmCoreConfigFactory, deps: [XM_CORE_EXTERNAL_CONFIG]},
            ],
        };
    }

}
