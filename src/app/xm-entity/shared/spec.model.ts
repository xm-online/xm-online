import { BaseSpec } from './base-spec';
import { XmEntitySpec } from './xm-entity-spec.model';

export interface Spec extends BaseSpec {
    key?: string;
    types?: XmEntitySpec[];
}
