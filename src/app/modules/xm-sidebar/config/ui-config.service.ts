import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ACache } from './a-cache';
import { UIConfig } from './ui-config-model';

export const UI_CONFIG_URL: string = 'config/api/profile/webapp/settings-public.yml?toJson';

@Injectable({ providedIn: 'root' })
export class UiConfigService extends ACache<UIConfig> {

    public url = UI_CONFIG_URL;

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
