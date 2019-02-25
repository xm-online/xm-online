export class ExtAutocompleteOptions {
    constructor(public placeholder?: string,
                public url?: string,
                public arrayField?: string,
                public labelField?: string,
                public valueField?: string,
                public relatedFields?: any[],
                public translations?: any,
                public htmlClass?: any) {
    }
}
