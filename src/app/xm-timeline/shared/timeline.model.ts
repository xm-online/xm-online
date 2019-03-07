export class Timeline {

    constructor(public rid?: string,
                public login?: string,
                public tenant?: string,
                public msName?: string,
                public operationName?: string,
                public entityId?: number,
                public entityKey?: string,
                public entityTypeKey?: string,
                public operationUrl?: string,
                public httpMethod?: string,
                public httpStatusCode?: number,
                public startDate?: any,
                public requestBody?: string,
                public requestLength?: number,
                public responseBody?: string,
                public responseLength?: number,
                public channelType?: string,
                public requestHeaders?: any,
                public responseHeaders?: any,
                public execTime?: number,
                public browser?: string,
                public opSystem?: string
    ) {
    }

}
