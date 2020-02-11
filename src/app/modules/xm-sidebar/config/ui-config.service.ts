import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ACache } from './a-cache';
import { takeUntilOnDestroy } from './takeUntilOnDestroy';
import { UIConfig } from './ui-config-model';
import {XmSessionService} from '@xm-ngx/core';

export const UI_CONFIG_URL = 'config/api/profile/webapp/settings-public.yml?toJson';

@Injectable({providedIn: 'root'})
export class UiConfigService<T = UIConfig> extends ACache<T> {

    public url: string = UI_CONFIG_URL;

    constructor(protected httpClient: HttpClient,
                protected sessionService: XmSessionService) {
        super();
        this.sessionService.get().pipe(takeUntilOnDestroy(this)).subscribe((session) => {
            if (session.active) {
                this.forceReload();
            } else { this.clear(); }
        });
    }

    public getAll(): Observable<T> {
        return this.httpClient.get<T>(this.url);
    }

    protected request(): Observable<T> {
        return this.getAll();
    }
}
