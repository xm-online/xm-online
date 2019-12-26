import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LinkSpec } from '../shared/link-spec.model';
import { Spec } from '../shared/spec.model';
import { XmEntity } from '../shared/xm-entity.model';

@Component({
    selector: 'xm-link-detail-dialog',
    templateUrl: './link-detail-dialog.component.html',
    styleUrls: ['./link-detail-dialog.component.scss'],
})
export class LinkDetailDialogComponent implements OnInit {

    @Input() public linkSpec: LinkSpec;
    @Input() public sourceXmEntity: XmEntity;
    @Input() public spec: Spec;

    public xmEntity: XmEntity;
    public mode: string;

    constructor(private activeModal: NgbActiveModal) {
    }

    public ngOnInit(): void {
        this.mode = this.linkSpec.builderType === 'NEW-OR-SEARCH' ? 'NEW' : this.linkSpec.builderType;
    }

    public onCancel(): void {
        this.activeModal.dismiss('cancel');
    }
}
