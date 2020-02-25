import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { XmToasterService } from '@xm-ngx/toaster';

import { Principal } from './principal.service';
import { StateStorageService } from './state-storage.service';

@Injectable()
export class UserRouteAccessService implements CanActivate, CanActivateChild {

    constructor(
        private router: Router,
        private principal: Principal,
        private stateStorageService: StateStorageService,
        private alertService: XmToasterService) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        return this.canActivateFunc(route, state);
    }

    public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        return this.canActivateFunc(route, state);
    }

    public checkLogin(url: string, privileges: any = {}): Promise<boolean> {
        const principal = this.principal;
        return Promise.resolve(principal.identity().then((account) => {
            if (account && privileges.value && privileges.value.length) {
                return principal.hasPrivileges(privileges.value, privileges.condition)
                    .then((result) => {
                        if (result instanceof Array) {
                            if (result.length) {
                                this.alertService.warning('error.privilegeInsufficient', {name: result.join(', ')});
                            }
                            return !result.length;
                        }
                        return result;
                    });
            }

            this.stateStorageService.storeUrl(url);
            this.router.navigate(['/']);
            return false;
        }));
    }

    private canActivateFunc(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        const privilagesPath = 'privileges';
        const privileges = route.data[privilagesPath] || {};
        if (!(privileges.value && privileges.value.length)) {
            return true;
        }
        return this.checkLogin(state.url, privileges);
    }
}
