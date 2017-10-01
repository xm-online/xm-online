import {UserLogin} from "./login/user-login.model";

export class User {
    public id?: any;
    public userKey?: string;
    public logins?: UserLogin[];
    public firstName?: string;
    public lastName?: string;
    public activated?: Boolean;
    public langKey?: string;
    public authorities?: any[];
    public createdBy?: string;
    public createdDate?: Date;
    public lastModifiedBy?: string;
    public lastModifiedDate?: Date;
    public password?: string;
    constructor(
        id?: any,
        userKey?: string,
        logins?: UserLogin[],
        firstName?: string,
        lastName?: string,
        activated?: Boolean,
        langKey?: string,
        authorities?: any[],
        createdBy?: string,
        createdDate?: Date,
        lastModifiedBy?: string,
        lastModifiedDate?: Date,
        password?: string
    ) {
        this.id = id ? id : null;
        this.userKey = userKey ? userKey : null;
        this.logins = logins ? logins : null;
        this.firstName = firstName ? firstName : null;
        this.lastName = lastName ? lastName : null;
        this.activated = activated ? activated : false;
        this.langKey = langKey ? langKey : null;
        this.authorities = authorities ? authorities : null;
        this.createdBy = createdBy ? createdBy : null;
        this.createdDate = createdDate ? createdDate : null;
        this.lastModifiedBy = lastModifiedBy ? lastModifiedBy : null;
        this.lastModifiedDate = lastModifiedDate ? lastModifiedDate : null;
        this.password = password ? password : null;
    }
}
