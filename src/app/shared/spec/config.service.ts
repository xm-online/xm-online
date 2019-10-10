import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { AsyncSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PasswordSpec } from '../../xm-entity/shared/password-spec.model';

import { Principal } from '../auth/principal.service';
import { ModulesLanguageHelper } from '../language/modules-language.helper';
import { XmApplicationConfigService } from './xm-config.service';

@Injectable()
export class XmConfigService {

    private configUrl = 'config/api/profile';
    private configMaintenanceUrl = 'config/api/config';
    private uaaPasswordConfigUrl = 'uaa/api/uaa/properties/settings-public';
    private elasticReindexUrl = '/entity/api/elasticsearch/index';

    private uiConfig;
    private uiConfigState = new AsyncSubject<any>();

    constructor(
        private http: HttpClient,
        private modulesLangHelper: ModulesLanguageHelper,
        private appConfig: XmApplicationConfigService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    private headers(): any {
        return {headers: new HttpHeaders({'Content-Type': 'text/plain'})};
    }

    validateTimelineSpec(configContent: string): Observable<any> {
        return this.http.post('timeline/api/timelines/properties/validate', configContent, this.headers()).pipe(
            map((res: any) => { return res; }));
    }

    updateTimelineSpec(configContent: string): Observable<any> {
        return this.http.post('timeline/api/timelines/properties', configContent, this.headers()).pipe(
            map((res: any) => { return res; }));
    }

    updateXmEntitySpec(configContent: string): Observable<any> {
        return this.http.post('entity/api/xm-entity-specs', configContent, this.headers()).pipe(
            map((res: any) => { return res; }));
    }

    updateConfig(configPath: string, configContent: string): Observable<any> {
        return this.http.put(this.configUrl + configPath, configContent, this.headers()).pipe(
            map((res: any) => { return res; }));
    }

    updateTenantSpec(configPath: string, configContent: string): Observable<any> {
        return this.http.put(this.configUrl + configPath, configContent, this.headers()).pipe(
            map((res: any) => { return res; }));
    }

    getConfig(configPath: string): Observable<string> {
        return this.http.get(this.configUrl + configPath, {responseType: 'text'}).pipe(
            map((res: any) => { return res; }));
    }

    getPasswordConfig(): Observable<string> {
        return this.http.get(this.uaaPasswordConfigUrl, {responseType: 'text'}).pipe(
            map((res: any) => { return res; }));
    }

    getUiConfigData() {
        if (this.uiConfig) {
            this.uiConfigState.next(this.uiConfig);
        } else {
            this.getConfigJson('/webapp/settings-public.yml?toJson').subscribe(uiConfig => {
                this.uiConfigState.next(this.uiConfig = uiConfig);
                this.uiConfigState.complete();
            });
        }
    }

    getUiConfig(): Observable<any> {
        return of(this.appConfig.getAppConfig());
    }

    getConfigJson(configPath: string): Observable<any> {
        return this.http.get(this.configUrl + configPath).pipe(
            map((res: any) => { return res; }));
    }

    getLoginsSpec(): Observable<any> {
        return this.http.get('uaa/api/logins').pipe(
            map((res: any) => { return res; }));
    }

    validateLoginsSpec(configContent: string): Observable<any> {
        return this.http.post('uaa/api/logins/validate', configContent, this.headers()).pipe(
            map((res: any) => { return res; }));
    }

    updateLoginsSpec(configContent: string): Observable<any> {
        return this.http.post('uaa/api/logins', configContent, this.headers()).pipe(
            map((res: any) => { return res; }));
    }

    validateUaaSpec(configContent: string) {
        return this.http.post('uaa/api/uaa/properties/validate', configContent, this.headers()).pipe(
            map((res: any) => { return res; }));
    }

    updateUaaSpec(configContent: string) {
        return this.http.post('uaa/api/uaa/properties', configContent, this.headers()).pipe(
            map((res: any) => { return res; }));
    }

    reindexTenantElastic() {
        return this.http.post(this.elasticReindexUrl, {});
    }

    updateTenantsConfig(): Observable<any> {
        // TODO Fix method to return JSON
        return this.http.post(this.configMaintenanceUrl + '/refresh', {});
    }

    updateTenantConfig(): Observable<any> {
        // TODO Fix method to return JSON
        return this.http.post(this.configUrl + '/refresh', {});
    }

    mapPasswordSettings(config?: any): PasswordSpec {
        const DEFAULT_SETTINGS = {
            minLength: 4,
            maxLength: 50,
            pattern: '',
            patternMessage: null,
        };
        if (!config) {return DEFAULT_SETTINGS}
        const CONFIG_PARSED = JSON.parse(config);
        if (CONFIG_PARSED && CONFIG_PARSED.passwordSettings) {
            const CONFIG: PasswordSpec = CONFIG_PARSED.passwordSettings;
            return {
                minLength: CONFIG.minLength || 4,
                maxLength: CONFIG.maxLength || 50,
                pattern: CONFIG.pattern || '',
                patternMessage: CONFIG.patternMessage || null
            };
        } else {
            return DEFAULT_SETTINGS;
        }
    }

    updatePatternMessage(message: any, currentLang?: string): string {
        const lang = currentLang ? currentLang : this.modulesLangHelper.getLangKey();
        return message[lang] || message;
    }
}
