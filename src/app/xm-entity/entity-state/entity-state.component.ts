import { Component, Input, OnInit } from '@angular/core';

import { StateSpec } from '../shared/state-spec.model';
import { Principal } from '../../shared/auth/principal.service';

@Component({
    selector: 'xm-entity-state',
    templateUrl: './entity-state.component.html',
    styleUrls: ['./entity-state.component.scss']
})
export class EntityStateComponent implements OnInit {

    @Input() stateSpec: StateSpec;

    constructor( public principal: Principal) {
    }

    ngOnInit() {
    }
}
