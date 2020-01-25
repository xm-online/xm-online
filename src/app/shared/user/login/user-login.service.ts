import { Injectable } from '@angular/core';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';
import { XM_EVENT_LIST } from '../../../xm.constants';
import { Principal } from '../../auth/principal.service';
import { XmConfigService } from '../../spec/config.service';
import { UserLogin } from './user-login.model';

@Injectable()
export class UserLoginService {

    private promise: Promise<any>;
    private allLogins: any = {};

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private specService: XmConfigService,
        private eventManager: JhiEventManager,
        private principal: Principal,
    ) {
        this.getAllLogins().then((logins) => this.allLogins = logins);
        this.registerChangeAuth();
    }

    public getAllLogins(): Promise<any> {
        if (this.promise) {
            return this.promise;
        }
        return this.promise = new Promise((resolve) => {
            this.specService.getLoginsSpec().toPromise().then(
                (result) => {
                    resolve(result.logins.reduce((map, obj) => {
                        map[obj.key] = obj;
                        return map;
                    }, {}));
                },
                () => this.promise = null,
            );
        });
    }

    public getLogin(login: UserLogin): string {
        if (!this.allLogins.hasOwnProperty(login.typeKey)) {
            return '';
        }
        return this.getName(login.typeKey) + ': ' + login.login;
    }

    public getName(typeKey: string): (string | number | 'MM/DD/YYYY HH:mm') | { name: 'English' } | any {
        const type = this.allLogins[typeKey];
        const name = type.name;
        const langKey = this.principal.getLangKey();
        if (name) {
            if (name[this.jhiLanguageService.currentLang]) {
                return name[this.jhiLanguageService.currentLang];
            } else if (name[langKey]) {
                return name[langKey];
            } else if (name.en) {
                return name.en;
            }
        }
        return type.key;
    }

    private registerChangeAuth(): void {
        this.eventManager.subscribe(XM_EVENT_LIST.XM_SUCCESS_AUTH, () => {
            this.allLogins = {};
            this.promise = null;
            this.getAllLogins().then((logins) => this.allLogins = logins);
        });
    }
}
