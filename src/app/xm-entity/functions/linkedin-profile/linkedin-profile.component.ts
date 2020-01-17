import { Component, Input, OnInit } from '@angular/core';

import { FunctionContext } from '../../shared/function-context.model';
import { XmEntity } from '../../shared/xm-entity.model';

@Component({
    selector: 'xm-linkedin-profile',
    templateUrl: './linkedin-profile.component.html',
    styleUrls: ['./linkedin-profile.component.scss'],
})
export class LinkedinProfileComponent implements OnInit {

    @Input() public xmEntity: XmEntity;
    @Input() public functionContext: FunctionContext;

    public profile: any;

    public ngOnInit(): void {
        if (this.functionContext && this.functionContext.data) {
            this.profile = this.functionContext.data.profile;
        }
    }

}
