export class AriChannel {
    constructor(public id?: string,
                public name?: string,
                public state?: string,
                public caller?: any,
                public connected?: any,
                public accountcode?: string,
                public dialplan?: any,
                public creationtime?: string,
                public language?: string) {
    }
}
