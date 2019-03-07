import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Pocket } from '..';
import { PocketService } from '../shared/pocket.service';

@Component({
    selector: 'xm-balance-detail-dialog',
    templateUrl: './balance-detail-dialog.component.html',
    styleUrls: ['./balance-detail-dialog.component.scss']
})
export class BalanceDetailDialogComponent implements OnInit {

    @Input() balanceId: number;

    pockets: Pocket[];

    constructor(private activeModal: NgbActiveModal,
                private pocketService: PocketService) {
    }

    ngOnInit() {
        this.pocketService.query({'balanceId.in': this.balanceId}).subscribe((pockets: HttpResponse<Pocket[]>) => {
            this.pockets = pockets.body;
        });
    }

    onCancel() {
        this.activeModal.dismiss('cancel');
    }

}
