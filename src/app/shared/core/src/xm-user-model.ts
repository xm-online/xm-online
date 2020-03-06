type Id = string | number;

export interface XmUserLogin {
    id?: Id;
    typeKey?: string;
    stateKey?: string;
    login?: string;
    removed?: boolean;
}

export interface XmUserPermission {
    msName?: string;
    roleKey?: string;
    privilegeKey?: string;
    enabled?: boolean;
    reactionStrategy?: string;
    envCondition?: string;
    resourceCondition?: string;
    resources?: string[];
    description?: string;
}


export interface XmUser {
    id?: Id;
    userKey?: string;
    logins?: XmUserLogin[];
    firstName?: string;
    lastName?: string;
    activated?: boolean;
    autoLogoutEnabled?: boolean;
    autoLogoutTimeoutSeconds?: number;
    langKey?: string;
    permissions?: XmUserPermission[];
    roleKey?: string;
    createdBy?: string;
    createdDate?: Date | string;
    lastModifiedBy?: string;
    lastModifiedDate?: Date | string;
    password?: string;
    tfaEnabled?: boolean;
    imageUrl?: string;
}
