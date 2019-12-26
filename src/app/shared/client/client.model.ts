export class Client {
    constructor(
        public id?: any,
        public clientId?: string,
        public clientSecret?: string,
        public roleKey?: string,
        public description?: string,
        public createdBy?: string,
        public createdDate?: Date,
        public lastModifiedBy?: string,
        public lastModifiedDate?: Date,
        public accessTokenValiditySeconds?: number,
        public scopes?: string[],
    ) {
    }
}
