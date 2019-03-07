import { Component, Input, OnInit } from '@angular/core';

import { FunctionContext } from '../../shared/function-context.model';
import { XmEntity } from '../../shared/xm-entity.model';

@Component({
    selector: 'xm-linkedin-profile',
    templateUrl: './linkedin-profile.component.html',
    styleUrls: ['./linkedin-profile.component.scss']
})
export class LinkedinProfileComponent implements OnInit {

    @Input() xmEntity: XmEntity;
    @Input() functionContext: FunctionContext;

    profile: any;

    constructor() {
    }

    ngOnInit() {
        if (this.functionContext && this.functionContext.data) {
            this.profile = this.functionContext.data.profile;
        }
    }

}
