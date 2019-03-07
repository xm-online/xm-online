export class Permission {
    constructor(
        public msName?: string,
        public roleKey?: string,
        public privilegeKey?: string,
        public enabled?: Boolean,
        public reactionStrategy?: string,
        public envCondition?: string,
        public resourceCondition?: string,
        public resources?: string[]
    ) {
    }
}
