import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { SUPER_ADMIN } from '../auth/auth.constants';
import { Principal } from '../auth/principal.service';
import { ParseByPathService } from '../services/parse-by-path.service';

@Injectable()
export class PrivilegeService {

    public privileges: any;
    private privilegeState: Subject<any> = new Subject<any>();

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
            });
    }

    public observable(path?: string): Observable<any> {
        return this.privilegeState.asObservable().pipe(
            map((result) => {
                return Object.assign({}, this.parseByPathService.parse(result, path));
            }));
    }

    private parsePrivileges(account: any = {}): any | { isSuperAdmin: true } {
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
            if (!obj.hasOwnProperty(key)) {(obj[key] = {}); }
            this.setValue(obj[key], pathArr.join('.'));
        } else {
            obj[`_${path/*.toLowerCase()*/}`] = true;
        }
    }
}
