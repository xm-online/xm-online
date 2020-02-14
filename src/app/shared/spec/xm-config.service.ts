import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VERSION } from '../../../app/xm.constants';

const THEME_STARTEGY = {
    DEFAULT: 'THEME',
    THEME: 'THEME',
    TENANT_ONLY: 'TENANT_ONLY',
};
const DEFAULT_THEME_NAME = 'teal';
const DEFAULT_THEME = `/themes/${DEFAULT_THEME_NAME}.css`;

@Injectable()
export class XmApplicationConfigService {

    public resolved$: BehaviorSubject<boolean>;
    public maintenance$: BehaviorSubject<boolean>;
    private configUrl: string = 'config/api/profile/webapp/settings-public.yml?toJson';
    private privateConfigUrl: string = 'config/api/profile/webapp/settings-private.yml?toJson';
    private appConfig: any;

    constructor(private http: HttpClient) {
        this.resolved$ = new BehaviorSubject<boolean>(false);
        this.maintenance$ = new BehaviorSubject<boolean>(false);
    }

    public loadAppConfig(): Promise<void> {
        // Should be !!promise!!, to wait until data is loaded
        return this.http.get(this.configUrl).toPromise().then((data: any) => {
            this.appConfig = data;
            if (data) {
                if (!data.theme) {
                    this.setResolved(true);
                    return;
                }
                const themeName = data.theme ? data.theme : DEFAULT_THEME_NAME;
                const themeStrategy = data.themeStrategy ? data.themeStrategy : THEME_STARTEGY.DEFAULT;
                const themePath = this.resolveThemePath(themeStrategy, themeName);
                console.info('version=%s apply theme name=%s strategy=%s path=%s',
                    VERSION, themeName, themeStrategy, themePath);
                this.applyTheme(themePath);
            } else {
                this.applyTheme(DEFAULT_THEME);
            }
        }, (err) => {
            console.warn(err);
            this.setMaintenanceProgress(true);
        });
    }

    public loadPrivateConfig(): Promise<void> {
        return this.http.get(this.privateConfigUrl).toPromise().then((data: any) => {
            this.appConfig = {
                ...this.appConfig,
                ...data,
            };
        }, (err) => {
            console.warn(err);
        });
    }

    public isResolved(): Observable<boolean> {
        return this.resolved$.asObservable();
    }

    public setResolved(newValue: boolean): void {
        this.resolved$.next(newValue);
    }

    public isMaintenanceProgress(): Observable<boolean> {
        return this.maintenance$.asObservable();
    }

    public setMaintenanceProgress(newValue: boolean): void {
        this.maintenance$.next(newValue);
    }

    public getAppConfig(): any {
        return this.appConfig;
    }

    private resolveThemePath(strategy: string, themeName: string): string {
        if (THEME_STARTEGY.TENANT_ONLY === strategy) {
            return `/assets/css/ext/${themeName}.css`;
        } else {
            return `/themes/${themeName}.css`;
        }
    }

    private applyTheme(styleSheet: string): void {
        const head = document.head || document.getElementsByTagName('head')[0];
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = styleSheet;
        head.appendChild(link);
        link.addEventListener('load', () => this.setResolved(true));
    }
}
