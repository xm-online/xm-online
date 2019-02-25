import { BaseSpec } from './../../shared';
import { XmEntitySpec } from './xm-entity-spec.model';

export class Spec implements BaseSpec {
    constructor(public key?: string,
                public types?: XmEntitySpec[]) {
    }
}
