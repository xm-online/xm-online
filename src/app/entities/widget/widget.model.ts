import { Dashboard } from '../dashboard';
export class Widget {
    constructor(
        public id?: number,
        public selector?: string,
        public name?: string,
        public config?: any,
        public isPublic?: boolean,
        public dashboard?: Dashboard,
        public component?: any
    ) {
        this.isPublic = false;
    }
}
