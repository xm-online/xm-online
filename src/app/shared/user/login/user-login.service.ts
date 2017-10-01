import {Injectable} from "@angular/core";
import {JhiLanguageService} from "ng-jhipster";
import {UserLogin} from "./user-login.model";
import {XmConfigService} from "../../../admin/configuration/config.service";
import {Principal} from "../../auth/principal.service";

@Injectable()
export class UserLoginService {

    private promise: Promise<any>;
    private allLogins: any;

    constructor(private jhiLanguageService: JhiLanguageService,
                private specService: XmConfigService,
                private principal: Principal) {
        this.getAllLogins().then(logins => this.allLogins = logins);
    }

    getAllLogins(): Promise<any> {
        if (this.promise) {
            return this.promise;
        }
        return this.promise = new Promise((resolve, reject) => {
            this.specService.getLoginsSpec().toPromise().then((result) => {
                resolve(result.logins.reduce(function (map, obj) {
                    map[obj.key] = obj;
                    return map;
                }, {}));
            });
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
        if (name) {
            if (name[this.jhiLanguageService.currentLang]) {
                return name[this.jhiLanguageService.currentLang];
            } else if (name[this.principal.getLangKey()]) {
                return name[this.principal.getLangKey()];
            } else if (name.en) {
                return name.en;
            }
        }
        return type.key;
    }
}
