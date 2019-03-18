import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const THEME_STARTEGY = {
    DEFAULT: 'THEME',
    THEME: 'THEME',
    TENANT_ONLY: 'TENANT_ONLY'
};
const DEFAULT_THEME_NAME = 'teal';
const DEFAULT_THEME = `/assets/css/themes/material-${DEFAULT_THEME_NAME}.css`;

@Injectable()
export class XmApplicationConfigService {

    private configUrl = 'config/api/profile/webapp/settings-public.yml?toJson';

    private appConfig;
    public resolved$: BehaviorSubject<boolean>;
    public maintenance$: BehaviorSubject<boolean>;

    constructor(private http: HttpClient) {
        this.resolved$ = new BehaviorSubject<boolean>(false);
        this.maintenance$ = new BehaviorSubject<boolean>(false);
    }

    public loadAppConfig() {
        // Should be !!promise!!, to wait until data is loaded
        return this.http.get(this.configUrl).toPromise().then((data: any) => {
            this.appConfig = data;
            let themeStrategy = THEME_STARTEGY.DEFAULT;
            let themeName = DEFAULT_THEME_NAME;
            if (data) {
                themeName = data.theme ? data.theme : DEFAULT_THEME_NAME;
                themeStrategy = data.themeStrategy ? data.themeStrategy : THEME_STARTEGY.DEFAULT;
                const themePath = this.resolveThemePath(themeStrategy, themeName);
                console.log('apply theme name=%s strategy=%s path=%s', themeName, themeStrategy, themePath);
                this.applyTheme(themePath);
            } else {
                this.applyTheme(DEFAULT_THEME);
            }
        }, err => {
            console.error(err);
            this.setMaintenanceProgress(true);
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

    getAppConfig() {
        return this.appConfig;
    }

    private resolveThemePath(strategy: string, themeName: string): string {
        if (THEME_STARTEGY.TENANT_ONLY === strategy) {
            return `/assets/css/ext/${themeName}.css`
        } else {
            return `/assets/css/themes/material-${themeName}.css`
        }
    }

    private applyTheme(styleSheet: string) {
        const head = document.head || document.getElementsByTagName('head') [0];
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = styleSheet;
        head.appendChild(link);
        link.addEventListener('load', () => this.setResolved(true));
    }
}
