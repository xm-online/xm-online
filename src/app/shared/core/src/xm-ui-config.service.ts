import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { takeUntilOnDestroy } from '@xm-ngx/shared/operators';
import { merge } from 'lodash';
import { Observable, of, zip } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, pluck } from 'rxjs/operators';
import { RequestCache } from './cache/request-cache';
import { XmCoreConfig } from './xm-core-config';
import { ISession, XmSessionService } from './xm-session.service';

import { XmUIConfig } from './xm-ui-config-model';

@Injectable({providedIn: 'root'})
export class XmUiConfigService<T = XmUIConfig> implements OnDestroy {

    protected requestCache: RequestCache<T>;

    constructor(protected httpClient: HttpClient,
                @Inject(XmCoreConfig) protected xmCoreConfig: XmCoreConfig,
                protected sessionService: XmSessionService) {
        this.requestCache = new RequestCache<T>(() => this.publicAPI());

        this.sessionService.get().pipe(
            takeUntilOnDestroy(this),
            filter<ISession>(Boolean),
            pluck('active'),
            distinctUntilChanged(),
            map((isActive: boolean) => isActive ? this.privateAndPublicAPI : this.publicAPI),
        ).subscribe((request) => {
            this.requestCache.request = request;
            this.requestCache.forceReload();
        });
    }

    public get cache$(): Observable<T | null> {
        return this.requestCache.get();
    }

    public next(value: T | null): Observable<T | null> {
        this.requestCache.next(value);
        return this.requestCache.get();
    }

    public ngOnDestroy(): void {
        this.requestCache.ngOnDestroy();
    }

    private publicAPI: () => Observable<T> = () => this.httpClient.get<T>(this.xmCoreConfig.UI_CONFIG_PUBLIC_URL);

    private privateAPI: () => Observable<T> = () => this.httpClient.get<T>(this.xmCoreConfig.UI_CONFIG_PRIVATE_URL);

    private privateAndPublicAPI: () => Observable<T> = () => zip(
        this.privateAPI().pipe(catchError(() => of(null))),
        this.publicAPI().pipe(catchError(() => of(null))),
    ).pipe(map(([pr, pu]) => merge(pu, pr)));
}
