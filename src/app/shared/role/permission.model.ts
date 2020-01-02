export interface Permission {
    msName?: string;
    roleKey?: string;
    privilegeKey?: string;
    enabled?: boolean;
    reactionStrategy?: string;
    envCondition?: string;
    resourceCondition?: string;
    resources?: string[];
}
