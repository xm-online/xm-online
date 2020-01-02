import { BaseEntity } from './../../shared';
import { Dashboard } from './dashboard.model';

export class Widget implements BaseEntity {
    constructor(
        public id?: number,
        public selector?: string,
        public name?: string,
        public config?: any,
        // tslint:disable-next-line:bool-param-default
        public isPublic?: boolean,
        public dashboard?: Dashboard,
        public module?: string,
        public component?: any,
    ) {
        this.isPublic = false;
    }
}
