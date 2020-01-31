import { Permission } from './permission.model';

export interface Role {
    roleKey?: string;
    basedOn?: string;
    description?: string;
    createdDate?: any;
    createdBy?: string;
    updatedDate?: any;
    updatedBy?: string;
    env?: string[];
    permissions?: Permission[];
}

export interface RoleMatrix {
    roles?: string[];
    permissions?: RoleMatrixPermission[];
}

export interface RoleMatrixPermission {
    msName?: string;
    privilegeKey?: string;
    roles?: any[];
    description?: string;
}
