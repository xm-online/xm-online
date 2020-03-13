import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { takeUntilOnDestroy } from '@xm-ngx/shared/operators';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestCache } from './cache/request-cache';
import { XmCoreConfig } from './xm-core-config';
import { XmSessionService } from './xm-session.service';
import { XmUser } from './xm-user-model';

@Injectable({
    providedIn: 'root',
})
export class XmUserService<T = XmUser> implements OnDestroy {

    protected requestCache: RequestCache<T> = new RequestCache<T>();

    constructor(
        protected httpClient: HttpClient,
        @Inject(XmCoreConfig) protected xmCoreConfig: XmCoreConfig,
        protected sessionService: XmSessionService,
    ) {
        this.sessionService.isActive().pipe(
            takeUntilOnDestroy(this),
            map((isActive: boolean) => isActive ? this.getUser : (): Observable<null> => of(null)),
        ).subscribe((request) => this.requestCache.setAndReload(request));
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

    private getUser: () => Observable<T> = () => this.httpClient.get<T>(this.xmCoreConfig.USER_URL);

}
