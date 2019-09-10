import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Principal } from '../auth/principal.service';
import { ParseByPathService } from '../services/parse-by-path.service';
import { SUPER_ADMIN } from '../auth/auth.constants';

@Injectable()
export class PrivilegeService {

    privileges: any;
    private privilegeState = new Subject<any>();

    constructor(
        private principal: Principal,
        private parseByPathService: ParseByPathService,
    ) {
        this.principal.getAuthenticationState()
            .subscribe((result) => {
                if (result) {
                    this.privileges = this.parsePrivileges(result);
                    this.privilegeState.next(this.privileges);
                }
            })
        ;
    }

    observable(path?: string): Observable<any> {
        return this.privilegeState.asObservable().pipe(
            map(result => {
                return Object.assign({}, this.parseByPathService.parse(result, path));
            }));
    }

    private parsePrivileges(account: any = {}) {
        if (SUPER_ADMIN === account.roleKey) {
            return {isSuperAdmin: true};
        }
        return account.privileges.reduce((result, el) => {
            this.setValue(result, el);
            return result;
        }, {});
    }

    private setValue(obj: any = {}, path: string = ''): any {
        const pathArr = path.split('.');
        if (pathArr.length > 1) {
            const key = pathArr.shift()/*.toLowerCase()*/;
            obj.hasOwnProperty(key) || (obj[key] = {});
            this.setValue(obj[key], pathArr.join('.'));
        } else  {
            obj[`_${path/*.toLowerCase()*/}`] = true;
        }
    }
}
