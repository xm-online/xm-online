import { BaseSpec } from './../../shared';
import { XmEntitySpec } from './xm-entity-spec.model';

export interface Spec extends BaseSpec {
    key?: string;
    types?: XmEntitySpec[];
}
