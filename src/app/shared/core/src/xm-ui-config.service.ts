import {HttpClient} from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs';

import {UIConfig} from './xm-ui-config-model';
import {takeUntilOnDestroy} from '@xm-ngx/shared/operators';
import {XmSessionService} from './xm-session.service';
import {RequestCache} from './cache/request-cache';
import {tap} from "rxjs/operators";

export const UI_CONFIG_URL = 'config/api/profile/webapp/settings-public.yml?toJson';

@Injectable({providedIn: 'root'})
export class XmUiConfigService<T = UIConfig> implements OnDestroy {

    public url: string = UI_CONFIG_URL;
    protected requestCache: RequestCache<T>;

    constructor(protected httpClient: HttpClient,
                protected sessionService: XmSessionService) {
        this.requestCache = new RequestCache(() => this.httpClient.get<T>(this.url));
        this.sessionService.get().pipe(takeUntilOnDestroy(this)).subscribe((session) => {
            if (session.active) {
                this.requestCache.forceReload();
            } else {
                this.requestCache.clear();
            }
        });
    }

    public get cache$(): Observable<T | null> {
        return this.requestCache.get();
    }

    public next(value: T | null): Observable<T | null> {
        this.requestCache.next(value);
        return this.requestCache.get();
    }

    public getAll(): Observable<T> {
        return this.httpClient.get<T>(this.url)
            .pipe(tap((res) => this.requestCache.next(res)));
    }

    public ngOnDestroy(): void {
        this.requestCache.ngOnDestroy();
    }
}
