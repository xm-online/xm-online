import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { JhiEventManager } from 'ng-jhipster';
import { FunctionSpec, NextSpec, StateSpec } from '..';
import { Principal } from '../../shared/auth/principal.service';
import { XM_EVENT_LIST } from '../../xm.constants';
import { AvatarDialogComponent } from '../avatar-dialog/avatar-dialog.component';
import { XmEntitySpec } from '../shared/xm-entity-spec.model';
import { XmEntity } from '../shared/xm-entity.model';

@Component({
    selector: 'xm-entity-card',
    templateUrl: './entity-card.component.html',
    styleUrls: ['./entity-card.component.scss'],
})
export class EntityCardComponent implements OnInit {

    @Input() public xmEntity: XmEntity;
    @Input() public xmEntitySpec: XmEntitySpec;

    public isAvatarEnabled: boolean;

    constructor(
        protected modalService: NgbModal,
        public principal: Principal,
        protected eventManager: JhiEventManager,
    ) {}

    get commonFunctionSpec(): FunctionSpec[] {
        return (this.xmEntitySpec && this.xmEntitySpec.functions) ?
            this.xmEntitySpec
                .functions
                .filter((item) => !item.withEntityId)
                .filter((item) => this.hasPrivilege(item))
                .filter((item) => this.allowedByState(item)) : [];
    }

    get entityFunctionSpec(): FunctionSpec[] {
        return (this.xmEntitySpec && this.xmEntitySpec.functions) ?
            this.xmEntitySpec
                .functions
                .filter((item) => item.withEntityId)
                .filter((item) => this.hasPrivilege(item))
                .filter((item) => this.allowedByState(item, this.xmEntity.stateKey)) : [];
    }

    public ngOnInit(): void {
        this.isAvatarEnabled = this.xmEntitySpec.isAvatarEnabled ? this.xmEntitySpec.isAvatarEnabled : false;
    }

    public getCurrentStateSpec(): StateSpec {
        return this.xmEntitySpec.states &&
            this.xmEntitySpec.states.filter((s) => s.key === this.xmEntity.stateKey).shift();
    }

    public onAvatarChangeClick(): void {
        const modalRef = this.modalService.open(AvatarDialogComponent, {backdrop: 'static'});
        modalRef.componentInstance.xmEntity = this.xmEntity;
    }

    public formatDescription(html: any): string {
        return html ? html.replace(/\r\n|\r|\n/g, '<br />') : '';
    }

    public getState(): StateSpec {
        const states = this.xmEntitySpec.states;
        return states ? states.filter((s) => s.key === this.xmEntity.stateKey).shift() : null;
    }

    public getNextStates(): NextSpec[] | null {
        const state = this.getState();
        return state && state.next
            ? state.next.map((n) => {
                const nextState: any = this.xmEntitySpec.states.find((s) => s.key === n.stateKey);
                // TODO: fix potencial undefined
                nextState.actionName = n.name;
                return nextState;
            })
            : null;
    }

    public onRefresh(_e: any): void {
        this.eventManager.broadcast({name: XM_EVENT_LIST.XM_ENTITY_DETAIL_MODIFICATION});
    }

    protected allowedByState(functionSpec: FunctionSpec, stateKey?: string): boolean {
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

    protected hasPrivilege(spec: FunctionSpec): boolean {
        const priv = spec.withEntityId ? 'XMENTITY.FUNCTION.EXECUTE' : 'FUNCTION.CALL';
        return this.principal.hasPrivilegesInline([priv, `${priv}.${spec.key}`]);
    }

}
