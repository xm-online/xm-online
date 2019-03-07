export class ResponseConfig {
    constructor(public responses: ResponseConfigItem[]) {
    }

    public getResponseConfigItem(rc) {
        return this.responses.filter(r => {
            return r.isMatch(rc)
        })[0];
    }
}

export class ResponseConfigItem {
    constructor(public code?: string,
                public codePath?: string,
                public status?: string,
                public type?: string,
                public validationField?: string,
                public validationFieldsExtractor?: string,
                public outputMessage?: {
                    type?: string,
                    value?: string
                },
                public condition?: any,
                public redirectUrl?: string) {
    }


    public isMatch(rc: ResponseContext) {
        const regExp = new RegExp(this.code);
        if ((this.status != null) && this.status !== rc.response.status) {
            return false;
        }
        if ((this.code != null) && !(regExp.test(this.getByPath(rc.response.error, this.codePath)))) {
            return false;
        }
        try {
            if ((this.condition != null) && !new Function('rc', this.condition)(rc)) {
                return false;
            }
        } catch (e) {
            console.error(e);
            return false;
        }

        return true;
    }

    private getByPath(obj, path) {
        let paths = path.split('.')
            , current = obj
            , i;
        for (i = 0; i < paths.length; ++i) {
            if (current[paths[i]] == undefined) {
                return undefined;
            } else {
                current = current[paths[i]];
            }
        }
        return current;
    }
}

export class ResponseContext {
    constructor(public response?: any,
                public request?: any) {
    }
}

