import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Data, Route, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionCheckStrategy, XmPermissionService } from './xm-permission.service';

export interface PermissionGuardData extends Data {
    privileges: {
        value: string[];
        strategy?: PermissionCheckStrategy;
    };
}

@Injectable({
    providedIn: 'root',
})
export class PermissionGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private permissionService: XmPermissionService) {
    }

    public canActivate(
        next: ActivatedRouteSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.isPermitted(this.getPermissions(next.data as PermissionGuardData));
    }

    public canActivateChild(
        next: ActivatedRouteSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.isPermitted(this.getPermissions(next.data as PermissionGuardData));
    }

    public canLoad(
        route: Route,
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.isPermitted(this.getPermissions(route.data as PermissionGuardData));
    }

    private getPermissions(data: PermissionGuardData): string[] {
        const privileges = data && data.privileges ? data.privileges : {value: undefined};
        return privileges.value ? privileges.value : [];
    }

    private isPermitted(permission: string[]): Observable<boolean> {
        return this.permissionService.hasPrivilegesBy(permission);
    }
}
