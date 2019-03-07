import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Principal } from '../../shared/auth/principal.service';
import { AvatarDialogComponent } from '../avatar-dialog/avatar-dialog.component';
import { XmEntitySpec } from '../shared/xm-entity-spec.model';
import { XmEntity } from '../shared/xm-entity.model';

@Component({
    selector: 'xm-entity-card',
    templateUrl: './entity-card.component.html',
    styleUrls: ['./entity-card.component.scss']
})
export class EntityCardComponent implements OnInit {

    @Input() xmEntity: XmEntity;
    @Input() xmEntitySpec: XmEntitySpec;

    isAvatarEnabled: boolean;

    constructor(private modalService: NgbModal,
                public principal: Principal) {
    }

    ngOnInit() {
        this.isAvatarEnabled = this.xmEntitySpec.isAvatarEnabled ? this.xmEntitySpec.isAvatarEnabled : false;
    }

    getCurrentStateSpec() {
        return this.xmEntitySpec.states &&
            this.xmEntitySpec.states.filter((s) => s.key === this.xmEntity.stateKey).shift();
    }

    onAvatarChangeClick() {
        const modalRef = this.modalService.open(AvatarDialogComponent, {backdrop: 'static'});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        return modalRef;
    }

    formatDescription(html) {
        return html ? html.replace(/\r\n|\r|\n/g, '<br />') : '';
    }

    getState() {
        const states = this.xmEntitySpec.states;
        return states ? states.filter(s => s.key === this.xmEntity.stateKey).shift() : null;
    }

    getNextStates() {
        const state = this.getState();
        return state && state.next ? state.next.map(n => {
            const nextState: any = this.xmEntitySpec.states.filter(s => s.key === n.stateKey).shift();
            // TODO: fix potencial undefined
            nextState.actionName = n.name;
            return nextState;
        }) : null;
    }

}
