import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { Principal, UIConfig, XmConfigService } from '../../../shared';

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

function optionsConfigToLogo(config: UIConfig): LogoOptions {

    return _.defaults({
        logoUrl: config.logoUrl,
        title: config.name,
        rootUrl: SPA_ROOT_URL,
        userRootUrl: SPA_AUTH_ROOT_URL,
    }, DEFAULT);
}

@Component({
    selector: 'xm-logo',
    templateUrl: './logo.component.html',
    host: {
        class: 'xm-logo',
    },
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
})
export class LogoComponent implements OnInit {

    public logo$: Observable<LogoOptions>;

    constructor(protected readonly xmConfigService: XmConfigService,
                protected readonly principal: Principal) { }

    public ngOnInit(): void {
        this.logo$ = this.xmConfigService.getUiConfig().pipe(
            map(optionsConfigToLogo),
            share(),
        );
    }

    public isAuthenticated(): boolean {
        return this.principal.isAuthenticated();
    }

}
