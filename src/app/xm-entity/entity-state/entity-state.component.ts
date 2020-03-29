import { Component, Input, NgModule } from '@angular/core';

import { StateSpec } from '@xm-ngx/entity';
import { XmSharedModule } from '@xm-ngx/shared';

@Component({
    selector: 'xm-entity-state',
    templateUrl: './entity-state.component.html',
    styleUrls: ['./entity-state.component.scss'],
})
export class EntityStateComponent {
    @Input() public stateSpec: StateSpec;
}

@NgModule({
    imports: [XmSharedModule],
    exports: [EntityStateComponent],
    declarations: [EntityStateComponent],
    entryComponents: [EntityStateComponent],
    providers: [],
})
export class EntityStateModule {
}
