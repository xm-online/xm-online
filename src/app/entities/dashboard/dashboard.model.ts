import { Widget } from '../widget';
export class Dashboard {
    constructor(
        public id?: number,
        public name?: string,
        public owner?: string,
        public layout?: any,
        public config?: string,
        public isPublic?: boolean,
        public widgets?: Widget,
    ) {
        this.isPublic = false;
    }
}
