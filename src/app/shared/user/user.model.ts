/* tslint:disable:bool-param-default */
import { UserLogin } from './login/user-login.model';

export class User {
    public id?: any;
    public userKey?: string;
    public logins?: UserLogin[];
    public firstName?: string;
    public lastName?: string;
    public activated?: boolean;
    public autoLogoutEnabled?: boolean;
    public autoLogoutTimeoutSeconds?: number;
    public langKey?: string;
    public permissions?: any[];
    public roleKey?: string;
    public createdBy?: string;
    public createdDate?: Date;
    public lastModifiedBy?: string;
    public lastModifiedDate?: Date;
    public password?: string;
    public tfaEnabled?: boolean;
    public imageUrl?: string;

    // tslint:disable-next-line:cognitive-complexity
    constructor(
        id?: any,
        userKey?: string,
        logins?: UserLogin[],
        firstName?: string,
        lastName?: string,
        activated?: boolean,
        autoLogoutEnabled?: boolean,
        autoLogoutTimeoutSeconds?: number,
        langKey?: string,
        permissions?: any[],
        roleKey?: string,
        createdBy?: string,
        createdDate?: Date,
        lastModifiedBy?: string,
        lastModifiedDate?: Date,
        password?: string,
        tfaEnabled?: boolean,
        imageUrl?: string,
    ) {
        this.id = id ? id : null;
        this.userKey = userKey ? userKey : null;
        this.logins = logins ? logins : null;
        this.firstName = firstName ? firstName : null;
        this.lastName = lastName ? lastName : null;
        this.activated = activated ? activated : false;
        this.autoLogoutEnabled = autoLogoutEnabled ? autoLogoutEnabled : false;

        if (this.autoLogoutEnabled) {
            this.autoLogoutTimeoutSeconds = autoLogoutTimeoutSeconds ? autoLogoutTimeoutSeconds : 60 * 30;
        } else {
            this.autoLogoutTimeoutSeconds = null;
        }

        this.langKey = langKey ? langKey : null;
        this.permissions = permissions ? permissions : null;
        this.roleKey = roleKey ? roleKey : null;
        this.createdBy = createdBy ? createdBy : null;
        this.createdDate = createdDate ? createdDate : null;
        this.lastModifiedBy = lastModifiedBy ? lastModifiedBy : null;
        this.lastModifiedDate = lastModifiedDate ? lastModifiedDate : null;
        this.password = password ? password : null;
        this.tfaEnabled = tfaEnabled ? tfaEnabled : false;
        this.imageUrl = imageUrl;
    }

}
