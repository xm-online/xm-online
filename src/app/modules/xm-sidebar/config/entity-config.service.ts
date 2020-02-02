import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthServerProvider } from '../../../shared';
import { XmEntitySpec } from '../../../xm-entity';
import { ACache } from './a-cache';
import { takeUntilOnDestroy } from './takeUntilOnDestroy';

export const ENTITY_CONFIG_URL = 'entity/api/xm-entity-specs';

@Injectable({
    providedIn: 'root',
})
export class EntityConfigService<T = XmEntitySpec> extends ACache<T[]> {

    public url: string = ENTITY_CONFIG_URL;

    constructor(protected httpClient: HttpClient,
                protected authServerProvider: AuthServerProvider) {
        super();
        this.authServerProvider.session$.pipe(takeUntilOnDestroy(this)).subscribe((session) => {
            if (session.active) {
                this.forceReload();
            } else { this.clear(); }
        });
    }

    public getAll(): Observable<T[]> {
        return this.httpClient.get<T[]>(this.url);
    }

    protected request(): Observable<T[]> {
        return this.getAll();
    }
}
