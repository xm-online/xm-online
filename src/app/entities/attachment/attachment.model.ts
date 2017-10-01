import { XmEntity } from '../xm-entity';
import { Content } from '../content';
export class Attachment {
    constructor(
        public id?: number,
        public typeKey?: string,
        public typeName?: string,
        public name?: string,
        public contentUrl?: string,
        public description?: string,
        public startDate?: any,
        public endDate?: any,
        public xmEntity?: XmEntity,
        public valueContentType?: string,
        public contentType?: string,
        public fileType?: string,
        public valueContentSize?: number,
        public contentSize?: string,
        public content?: Content,
    ) {
    }
}
