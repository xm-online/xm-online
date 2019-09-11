export interface PasswordSpec {
    minLength?: number,
    maxLength?: number,
    pattern?: string,
    patternMessage?: any,
    enableBackEndValidation?: boolean
}
