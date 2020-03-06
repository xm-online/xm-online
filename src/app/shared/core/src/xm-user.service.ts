import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { takeUntilOnDestroy } from '@xm-ngx/shared/operators';
import { Observable, of } from 'rxjs';
import { RequestCache } from './cache/request-cache';
import { XM_CORE_CONFIG, XmCoreConfig } from './xm-core-config';
import { XmSessionService } from './xm-session.service';
import { XmUser } from './xm-user-model';

@Injectable({
    providedIn: 'root',
})
export class XmUserService<T = XmUser> implements OnDestroy {

    protected requestCache: RequestCache<T> = new RequestCache<T>();

    constructor(protected httpClient: HttpClient,
                @Inject(XM_CORE_CONFIG) protected xmCoreConfig: XmCoreConfig,
                protected sessionService: XmSessionService) {
    }

    public get user$(): Observable<T | null> {
        return this.requestCache.get();
    }

    public next(value: T | null): Observable<T | null> {
        this.requestCache.next(value);
        return this.requestCache.get();
    }

    public ngOnDestroy(): void {
        this.requestCache.ngOnDestroy();
    }

    public init(): void {
        const getUser = (): Observable<T> => this.httpClient.get<T>(this.xmCoreConfig.USER_URL);

        this.requestCache.request = getUser;

        this.sessionService.get().pipe(takeUntilOnDestroy(this)).subscribe((session) => {
            if (session.active) {
                this.requestCache.request = getUser;
            } else {
                this.requestCache.request = () => of(null);
            }
            this.requestCache.forceReload();
        });
    }
}
