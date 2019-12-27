import { Component, Input, OnInit } from '@angular/core';

import { Principal } from '../../shared/auth/principal.service';
import { StateSpec } from '../shared/state-spec.model';

@Component({
    selector: 'xm-entity-state',
    templateUrl: './entity-state.component.html',
    styleUrls: ['./entity-state.component.scss'],
})
export class EntityStateComponent implements OnInit {

    @Input() public stateSpec: StateSpec;

    constructor(public principal: Principal) {
    }

    public ngOnInit(): void {
    }
}
