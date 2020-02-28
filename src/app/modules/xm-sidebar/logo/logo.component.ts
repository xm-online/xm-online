import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { Principal } from '../../../shared';
import { XmUIConfig, XmUiConfigService } from '@xm-ngx/core';

export const SPA_ROOT_URL = '/';
export const SPA_AUTH_ROOT_URL = '/dashboard';

interface LogoOptions {
    logoUrl: string;
    title: string;
    rootUrl: string;
    userRootUrl: string;
}

const DEFAULT: LogoOptions = {
    logoUrl: '',
    title: '',
    rootUrl: '',
    userRootUrl: '',
};

function optionsConfigToLogo(config: XmUIConfig): LogoOptions {

    return _.defaults({
        logoUrl: config ? config.logoUrl: '',
        title: config? config.name: '',
        rootUrl: SPA_ROOT_URL,
        userRootUrl: SPA_AUTH_ROOT_URL,
    }, DEFAULT);
}

@Component({
    selector: 'xm-logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class LogoComponent implements OnInit {

    public logo$: Observable<LogoOptions>;

    constructor(protected readonly xmUiConfigService: XmUiConfigService,
                protected readonly principal: Principal) { }

    public ngOnInit(): void {
        this.logo$ = this.xmUiConfigService.cache$.pipe(
            map(optionsConfigToLogo),
            share(),
        );
    }

    public isAuthenticated(): boolean {
        return this.principal.isAuthenticated();
    }

}
