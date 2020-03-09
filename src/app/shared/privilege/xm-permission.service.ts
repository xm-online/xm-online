import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { XmUser, XmUserPermission } from '../core/src/xm-user-model';
import { XmUserService } from '../core/src/xm-user.service';

function getPrivileges(permissions: XmUserPermission[]): string[] {
    return _.reduce(permissions, (result, el) => {
        if (el.enabled) {
            result.push(el.privilegeKey);
        }
        return result;
    }, []);
}

export enum PermissionCheckStrategy {
    ALL = 'all',
    ANY = 'any'
}

@Injectable({
    providedIn: 'root',
})
export class XmPermissionService {

    constructor(protected userService: XmUserService) {
    }

    public get permissions$(): Observable<XmUserPermission[]> {
        return this.userService.user$.pipe(
            filter(Boolean),
            map((u: XmUser) => u.permissions));
    }

    public get privileges$(): Observable<string[]> {
        return this.permissions$.pipe(map(getPrivileges));
    }

    public hasPrivilege(privilege: string): Observable<boolean> {
        if (!privilege) {
            throw new Error('The privilege is empty!');
        }
        return this.privileges$.pipe(map((arr) => _.includes(arr, privilege)));
    }

    public hasPrivileges(privileges: string[]): Observable<boolean> {
        if (!privileges && !privileges.length) {
            throw new Error('The privileges array is empty!');
        }
        return this.privileges$.pipe(map((arr) => _.intersection(arr, privileges).length === privileges.length));
    }

    public hasAnyPrivilege(privileges: string[]): Observable<boolean> {
        if (!privileges && !privileges.length) {
            throw new Error('The privileges array is empty!');
        }
        return this.privileges$.pipe(map((arr) => _.intersection(arr, privileges).length !== 0));
    }

    public hasPrivilegesBy(
        privileges: string[],
        strategy: PermissionCheckStrategy = PermissionCheckStrategy.ALL,
    ): Observable<boolean> {
        switch (strategy) {
            case PermissionCheckStrategy.ALL:
                return this.hasPrivileges(privileges);
            case PermissionCheckStrategy.ANY:
                return this.hasAnyPrivilege(privileges);
            default:
                return this.hasPrivileges(privileges);
        }
    }
}
