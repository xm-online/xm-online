import { BaseEntity } from './../../shared';

export class Content implements BaseEntity {
    constructor(public id?: number,
                public valueContentType?: string,
                public value?: any) {
    }
}
