export class ChangePassword {
    constructor(
        public oldPassword?: string,
        public newPassword?: string,
        public confirmNewPassword?: string,
    ) { }
}
