import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestCache } from '../cache/request-cache';
import { XmCoreConfig } from '../xm-core-config';
import { UIPublicConfig } from './xm-ui-config-model';

@Injectable({
    providedIn: 'root',
})
export class XmPublicUiConfigService<T = UIPublicConfig> implements OnDestroy {
    private requestCache: RequestCache<T> = new RequestCache<T>(() => this.publicAPI());

    constructor(private httpClient: HttpClient,
                private xmCoreConfig: XmCoreConfig) {
    }

    public get config$(): Observable<T | null> {
        return this.requestCache.get();
    }

    public ngOnDestroy(): void {
        this.requestCache.ngOnDestroy();
    }

    private publicAPI(): Observable<T> {
        return this.httpClient.get<T>(this.xmCoreConfig.UI_PUBLIC_CONFIG_URL);
    }

}
