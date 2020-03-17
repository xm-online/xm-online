import { BaseEntity } from '@xm-ngx/entity';
import { Dashboard } from './dashboard.model';

export interface Widget extends BaseEntity {
    id?: number;
    selector?: string;
    name?: string;
    config?: any;
    isPublic?: boolean;
    dashboard?: Dashboard;
    module?: string;
    component?: any;
}
