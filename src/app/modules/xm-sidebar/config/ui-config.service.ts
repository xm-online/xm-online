import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthServerProvider } from '../../../shared';
import { ACache } from './a-cache';
import { takeUntilOnDestroy } from './takeUntilOnDestroy';
import { UIConfig } from './ui-config-model';

export const UI_CONFIG_URL = 'config/api/profile/webapp/settings-public.yml?toJson';

@Injectable({providedIn: 'root'})
export class UiConfigService<T = UIConfig> extends ACache<T> {

    public url: string = UI_CONFIG_URL;

    constructor(protected httpClient: HttpClient,
                protected authServerProvider: AuthServerProvider) {
        super();
        this.authServerProvider.session$.pipe(takeUntilOnDestroy(this)).subscribe((session) => {
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
