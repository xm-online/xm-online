import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { XmEntitySpec } from '../../../xm-entity';
import { ACache } from './a-cache';
import { UIConfig } from './ui-config-model';

export const ENTITY_CONFIG_URL = 'entity/api/xm-entity-specs';

@Injectable({
    providedIn: 'root',
})
export class EntityConfigService extends ACache<XmEntitySpec[]> {

    public url: string = ENTITY_CONFIG_URL;

    constructor(protected httpClient: HttpClient) {
        super();
    }

    public getAll(): Observable<UIConfig> {
        return this.httpClient.get(this.url);
    }

    protected request(): Observable<UIConfig> {
        return this.getAll();
    }
}
