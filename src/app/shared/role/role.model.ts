import {Permission} from "./permission.model";

export class Role {
    constructor(
        public roleKey?: string,
        public basedOn?: string,
        public description?: string,
        public createdDate?: any,
        public createdBy?: string,
        public updatedDate?: any,
        public updatedBy?: string,
        public env?: string[],
        public permissions?: Permission[]
    ) {
    }
}

export class RoleMatrix {
    constructor(
        public roles?: string[],
        public permissions?: RoleMatrixPermission[],
    ) {
    }
}


export class RoleMatrixPermission {
    constructor(
        public msName?: string,
        public privilegeKey?: string,
        public roles?: any[],
    ) {
    }
}
