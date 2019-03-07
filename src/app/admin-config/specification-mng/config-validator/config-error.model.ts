export class ConfigError {

    constructor(public message?: string,
                public line?: number,
                public snippet?: string,
                public path?: string) {
    }

}
