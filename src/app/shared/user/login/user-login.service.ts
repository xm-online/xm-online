import {Injectable} from '@angular/core';
import {JhiEventManager, JhiLanguageService} from 'ng-jhipster';
import {UserLogin} from './user-login.model';
import {XmConfigService} from '../../spec/config.service';
import {Principal} from '../../auth/principal.service';
import {XM_EVENT_LIST} from '../../../xm.constants';

@Injectable()
export class UserLoginService {

    private promise: Promise<any>;
    private allLogins: any = {};

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private specService: XmConfigService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
        this.getAllLogins().then(logins => this.allLogins = logins);
        this.registerChangeAuth();
    }

    private registerChangeAuth() {
        this.eventManager.subscribe(XM_EVENT_LIST.XM_SUCCESS_AUTH, resp => {
            this.allLogins = {};
            this.promise = null;
            this.getAllLogins().then(logins => this.allLogins = logins);
        });
    }

    getAllLogins(): Promise<any> {
        if (this.promise) {
            return this.promise;
        }
        return this.promise = new Promise((resolve) => {
            this.specService.getLoginsSpec().toPromise().then(
                (result) => {
                    resolve(result.logins.reduce(function (map, obj) {
                        map[obj.key] = obj;
                        return map;
                    }, {}));
                },
                () => this.promise = null
            );
        })
    }

    getLogin(login: UserLogin) {
        if (!this.allLogins.hasOwnProperty(login.typeKey)) {
            return;
        }
        return this.getName(login.typeKey) + ': ' + login.login;
    }

    getName(typeKey) {
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
}
