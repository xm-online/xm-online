import { Attachment } from '../attachment';
import { Calendar } from '../calendar';
import { Location } from '../location';
import { Rating } from '../rating';
import { Tag } from '../tag';
import { Comment } from '../comment';
import { Vote } from '../vote';
import { Link } from '../link';
import { Event } from '../event';
import {XmFunction} from "../xm-function/xm-function.model";
export class XmEntity {
    constructor(
        public id?: number,
        public key?: string,
        public typeKey?: string,
        public stateKey?: string,
        public name?: string,
        public startDate?: any,
        public updateDate?: any,
        public endDate?: any,
        public avatarUrl?: string,
        public description?: string,
        public data?: any,
        public attachments?: Attachment[],
        public functions?: XmFunction[],
        public calendars?: Calendar[],
        public locations?: Location[],
        public ratings?: Rating[],
        public tags?: Tag[],
        public comments?: Comment[],
        public votes?: Vote[],
        public sources?: Link[],
        public targets?: Link[],
        public event?: Event,
    ) {
    }
}
