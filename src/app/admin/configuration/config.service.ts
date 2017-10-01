import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, Headers, RequestOptionsArgs} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {EventManager} from 'ng-jhipster';
import {Principal} from '../../shared/auth/principal.service';

@Injectable()
export class XmConfigService {

    private configUrl = 'config/api/profile';

    constructor(private http: Http,
                private eventManager: EventManager,
                private principal: Principal) {
    }

    private headers(): RequestOptions {
        let headers = new Headers({ 'Content-Type': 'text/plain' });
        let optArgs: RequestOptionsArgs = { headers: headers };
        return new RequestOptions(optArgs);
    }

    validateTimelineSpec(configContent: string): Observable<Response> {
        return this.http.post('timeline/api/timelines/properties/validate', configContent, this.headers()).map((res: Response) => {
            return res;
        });
    }

    updateTimelineSpec(configContent: string): Observable<Response> {
        return this.http.post('timeline/api/timelines/properties', configContent, this.headers()).map((res: Response) => {
            return res;
        });
    }

    updateXmEntitySpec(configContent: string): Observable<Response> {
        return this.http.post('entity/api/xm-entity-specs', configContent, this.headers()).map((res: Response) => {
            return res;
        });
    }

    updateConfig(configPath: string, configContent: string): Observable<Response> {
        return this.http.put(this.configUrl + configPath, configContent, this.headers()).map((res: Response) => {
            return res;
        });
    }

    getConfig(configPath: string): Observable<string> {
        return this.http.get(this.configUrl + configPath).map((res: Response) => {
            return res.text();
        });
    }

    private uiConfig;
    getUiConfig() {
        if (this.uiConfig) {
            return Observable.of(this.uiConfig);
        }
        let config = this.getConfigJson('/webapp/settings-public.yml?toJson');
        config.subscribe(uiConfig => this.uiConfig = uiConfig);
        return config;
    }

    getConfigJson(configPath: string): Observable<any> {
        return this.http.get(this.configUrl + configPath).map((res: Response) => {
            return res.json();
        });
    }

    getLoginsSpec(): Observable<any> {
        return this.http.get('uaa/api/logins').map((res: Response) => {
            return res.json();
        });
    }

    validateLoginsSpec(configContent: string): Observable<Response> {
        return this.http.post('uaa/api/logins/validate', configContent, this.headers()).map((res: Response) => {
            return res;
        });
    }

    updateLoginsSpec(configContent: string): Observable<Response> {
        return this.http.post('uaa/api/uaa/logins', configContent, this.headers()).map((res: Response) => {
            return res;
        });
    }

    validateUaaSpec(configContent: string) {
        return this.http.post('uaa/api/uaa/properties/validate', configContent, this.headers()).map((res: Response) => {
            return res;
        });
    }

    updateUaaSpec(configContent: string) {
        return this.http.post('uaa/api/uaa/properties', configContent, this.headers()).map((res: Response) => {
            return res;
        });
    }

    initSocialConfiguration(callback) {
        this.getUiConfig().subscribe(config => {
            this.http.get('uaa/social/providers', this.headers()).subscribe((res: Response) => {
                let providers = res.json();
                let socialConfiguration = config.socialConfiguration || {};
                for (let key in socialConfiguration) {
                    let providerId = key.substring(0, key.indexOf('Enabled'));
                    if (!providers || !this.hasSocialConfig(providers, providerId)) {
                        let msg = `Not found uaa configuration for ${providerId} and domain ${window.location.hostname}`;
                        console.warn(msg);
                        socialConfiguration[providerId + 'Enabled'] = false;
                    }
                }
                callback(socialConfiguration);
            });
        });
    }

    private hasSocialConfig(providers, providerId) {
        providers = providers ? providers : [];
        for(let provider of providers) {
            if (provider == providerId) {
                return true;
            }
        }
        return false;
    }

    validateEntitySpec(configContent: string) {
        return this.http.post('entity/api/xm-entity-specs/validate', configContent, this.headers()).map((res: Response) => {
            return res;
        });
    }

}
