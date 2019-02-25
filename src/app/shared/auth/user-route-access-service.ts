import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

import { Principal } from './principal.service';
import { StateStorageService } from './state-storage.service';
import { JhiAlertService } from 'ng-jhipster';

@Injectable()
export class UserRouteAccessService implements CanActivate, CanActivateChild {

    constructor(
        private router: Router,
        private principal: Principal,
        private stateStorageService: StateStorageService,
        private alertService: JhiAlertService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        return this.canActivateFunc(route, state);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        return this.canActivateFunc(route, state);
    }

    checkLogin(url: string, privileges: any = {}): Promise<boolean> {
        const principal = this.principal;
        return Promise.resolve(principal.identity().then((account) => {

            /*if (account && principal.hasAnyAuthority(authorities)) {
             return true;
             }*/

            if (account) {
                if (privileges.value && privileges.value.length) {
                    return principal.hasPrivileges(privileges.value, privileges.condition)
                        .then(result => {
                            if (result instanceof Array) {
                                result.length && this.alertService.warning('error.privilegeInsufficient', {name: result.join(', ')});
                                return !result.length;
                            }
                            return result;
                        });
                }
            }

            this.stateStorageService.storeUrl(url);
            this.router.navigate(['/']);
            return false;
        }));
    }

    private canActivateFunc(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        const privileges = route.data['privileges'] || {};
        if (!(privileges.value && privileges.value.length)) {
            return true;
        }
        return this.checkLogin(state.url, privileges);
    }
}
