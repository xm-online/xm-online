import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { XmPrivateUiConfigService } from './xm-private-ui-config.service';
import { XmPublicUiConfigService } from './xm-public-ui-config.service';

import { XmUIConfig } from './xm-ui-config-model';

@Injectable({providedIn: 'root'})
export class XmUiConfigService<T extends XmUIConfig = XmUIConfig> {

    constructor(private privateUiConfigService: XmPrivateUiConfigService,
                private publicUiConfigService: XmPublicUiConfigService) {
    }

    public get cache$(): Observable<T> {
        return combineLatest([
            this.publicUiConfigService.config$,
            this.privateUiConfigService.config$.pipe(startWith(null)),
        ]).pipe(
            map((res) => _.merge.apply(null, res)),
        );
    }

}
