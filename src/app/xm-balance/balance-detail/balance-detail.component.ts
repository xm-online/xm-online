import {Component, Input, OnInit} from '@angular/core';

import {Pocket} from '..';
import {PocketService} from '../shared/pocket.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
    selector: 'xm-balance-detail',
    templateUrl: './balance-detail.component.html',
    styleUrls: ['./balance-detail.component.scss']
})
export class BalanceDetailComponent implements OnInit {
    @Input() balanceId: number;
    pockets$: Observable<Pocket[]>;

    constructor(
                private pocketService: PocketService) {
    }

    ngOnInit() {
        this.pockets$ = this.pocketService.query({'balanceId.in': this.balanceId})
            .pipe(map(response => response.body))
    }
}
