import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';

import { Principal } from '../../shared';
import { ContextService } from '../../shared/context/context.service';
import { FunctionListSectionComponent } from '../function-list-section/function-list-section.component';
import { XmEntityService } from '../shared/xm-entity.service';

@Component({
    selector: 'xm-function-list-section-compact',
    templateUrl: './function-list-section-compact.component.html',
    styleUrls: ['./function-list-section-compact.component.scss'],
})
export class FunctionListSectionCompactComponent extends FunctionListSectionComponent {

    constructor(protected xmEntityService: XmEntityService,
                protected modalService: NgbModal,
                protected eventManager: JhiEventManager,
                protected translateService: TranslateService,
                protected contextService: ContextService,
                public principal: Principal) {
        super(xmEntityService, modalService, eventManager, translateService, contextService, principal);
    }

}
