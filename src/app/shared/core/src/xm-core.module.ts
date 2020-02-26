import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {defaults} from 'lodash';
import { RequestCache } from './cache/request-cache';

import {XmSessionService} from './xm-session.service';
import {XmUiConfigService} from './xm-ui-config.service';
import {XM_CORE_CONFIG, XM_CORE_CONFIG_DEFAULT, XM_CORE_EXTERNAL_CONFIG, XmCoreConfig} from './xm-core-config';

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
                XmSessionService,
                XmUiConfigService,
                {provide: XM_CORE_EXTERNAL_CONFIG, useValue: externalConfig},
                {provide: XM_CORE_CONFIG, useFactory: xmCoreConfigFactory, deps: [XM_CORE_EXTERNAL_CONFIG]},
            ],
        }
    }

}
