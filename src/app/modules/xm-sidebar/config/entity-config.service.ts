import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { takeUntilOnDestroy } from '@xm-ngx/shared/operators';
import { Observable } from 'rxjs';
import { XmEntitySpec } from '../../../xm-entity';
import { ACache } from './a-cache';

import {XmSessionService} from '@xm-ngx/core';

export const ENTITY_CONFIG_URL = 'entity/api/xm-entity-specs';

@Injectable({
    providedIn: 'root',
})
export class EntityConfigService<T = XmEntitySpec> extends ACache<T[]> {

    public url: string = ENTITY_CONFIG_URL;

    constructor(protected httpClient: HttpClient,
                protected sessionService: XmSessionService) {
        super();
        this.sessionService.get().pipe(takeUntilOnDestroy(this)).subscribe((session) => {
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
