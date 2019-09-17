import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Principal } from '../../shared/auth/principal.service';
import { AvatarDialogComponent } from '../avatar-dialog/avatar-dialog.component';
import { XmEntitySpec } from '../shared/xm-entity-spec.model';
import { XmEntity } from '../shared/xm-entity.model';
import { JhiEventManager } from 'ng-jhipster';
import { XM_EVENT_LIST } from '../../xm.constants';
import { FunctionSpec } from '..';

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
                public principal: Principal,
                private eventManager: JhiEventManager) {
    }

    ngOnInit() {
        this.isAvatarEnabled = this.xmEntitySpec.isAvatarEnabled ? this.xmEntitySpec.isAvatarEnabled : false;
    }

    getCurrentStateSpec() {
        return this.xmEntitySpec.states &&
            this.xmEntitySpec.states.filter((s) => s.key === this.xmEntity.stateKey).shift();
    }

    public onAvatarChangeClick(): void {
        const modalRef = this.modalService.open(AvatarDialogComponent, {backdrop: 'static'});
        modalRef.componentInstance.xmEntity = this.xmEntity;
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

    onRefresh(e) {
        this.eventManager.broadcast({name: XM_EVENT_LIST.XM_ENTITY_DETAIL_MODIFICATION});
    }

    get commonFunctionSpec(): FunctionSpec[] {
        return (this.xmEntitySpec && this.xmEntitySpec.functions) ?
          this.xmEntitySpec
              .functions
              .filter(item => !item.withEntityId)
              .filter(item => this.hasPrivilege(item))
              .filter(item => this.allowedByState(item)) : [];
    }

    get entityFunctionSpec(): FunctionSpec[] {
        return (this.xmEntitySpec && this.xmEntitySpec.functions) ?
            this.xmEntitySpec
                .functions
                .filter(item => item.withEntityId)
                .filter(item => this.hasPrivilege(item))
                .filter(item => this.allowedByState(item, this.xmEntity.stateKey)) : [];
    }

    private allowedByState(functionSpec: FunctionSpec, stateKey?: string): boolean {
        // if no allowedStateKeys - always allowed
        if (!functionSpec.allowedStateKeys || !functionSpec.allowedStateKeys.length) {
            return true;
        }
        // if includes NEVER - do not show
        if (functionSpec.allowedStateKeys.includes('NEVER')) {
            return false;
        }

        // if xmEntity function - validate entity state
        if (functionSpec.withEntityId && stateKey) {
            return functionSpec.allowedStateKeys.includes(stateKey);
        }

        return true;
    }

    private hasPrivilege(spec: FunctionSpec): boolean {
        const priv = spec.withEntityId ? 'XMENTITY.FUNCTION.EXECUTE' : 'FUNCTION.CALL';
        return this.principal.hasPrivilegesInline([priv, `${priv}.${spec.key}`]);
    }

}
