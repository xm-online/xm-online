import { Dashboard } from '../dashboard';
export class Profile {
    constructor(
        public id?: number,
        public userKey?: string,
        public dashboards?: Dashboard,
    ) {
    }
}
