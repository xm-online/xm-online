
export class PasswordSpec {
    constructor(
        public minLength?: number,
        public maxLength?: number,
        public pattern?: string,
        public patternMessage?: any,
        protected enableBackEndValidation?: boolean) {
    }
}
