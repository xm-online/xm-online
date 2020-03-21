import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { XmPermissionService } from '@xm-ngx/core/permission';
import { takeUntilOnDestroy } from '@xm-ngx/shared/operators';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RequestCache } from '../cache/request-cache';
import { XmCoreConfig } from '../xm-core-config';
import { UIPrivateConfig } from './xm-ui-config-model';

@Injectable({
    providedIn: 'root',
})
export class XmPrivateUiConfigService<T = UIPrivateConfig> implements OnDestroy {
    private requestCache: RequestCache<T> = new RequestCache<T>(() => this.privateAPI());

    constructor(private httpClient: HttpClient,
                private permissionService: XmPermissionService,
                private xmCoreConfig: XmCoreConfig) {
    }

    public get config$(): Observable<T | null> {
        return this.permissionService.hasPrivilege(this.xmCoreConfig.UI_PRIVATE_CONFIG_PERMISSION).pipe(
            takeUntilOnDestroy(this),
            switchMap(() => this.requestCache.get()),
        );
    }

    public ngOnDestroy(): void {
        this.requestCache.ngOnDestroy();
    }

    private privateAPI(): Observable<T> {
        return this.httpClient.get<T>(this.xmCoreConfig.UI_PRIVATE_CONFIG_URL);
    }

}
