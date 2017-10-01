export class UserLogin {
    public id?: any;
    public typeKey?: string;
    public stateKey?: string;
    public login?: string;
    public removed?: boolean;

    constructor(id: any, typeKey: string, stateKey: string, login: string, removed: boolean) {
        this.id = id;
        this.typeKey = typeKey;
        this.stateKey = stateKey;
        this.login = login;
        this.removed = removed;
    }
}