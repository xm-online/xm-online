import { Dashboard } from '../dashboard';
export class DefaultProfile {
    constructor(
        public id?: number,
        public roleKey?: string,
        public dashboard?: Dashboard,
    ) {
    }
}
