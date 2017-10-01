import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Principal } from './principal.service';
import { StateStorageService } from './state-storage.service';

@Injectable()
export class UserRouteAccessService implements CanActivate {

    constructor(private router: Router,
                private principal: Principal,
                private stateStorageService: StateStorageService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {

        const authorities = route.data['authorities'];
        if (!authorities || authorities.length === 0) {
            return true;
        }

        return this.checkLogin(authorities, state.url);
    }

    checkLogin(authorities: string[], url: string): Promise<boolean> {
        const principal = this.principal;
        return Promise.resolve(principal.identity().then((account) => {

            if (account && principal.hasAnyAuthority(authorities)) {
                return true;
            }

            this.stateStorageService.storeUrl(url);
            this.router.navigate(['accessdenied']).then(() => {
                // TODO: route to the login page
                // this.loginModalService.open();
            });
            return false;
        }));
    }
}
