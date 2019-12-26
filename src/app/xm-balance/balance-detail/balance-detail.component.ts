import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Pocket } from '..';
import { PocketService } from '../shared/pocket.service';

@Component({
    selector: 'xm-balance-detail',
    templateUrl: './balance-detail.component.html',
    styleUrls: ['./balance-detail.component.scss'],
})
export class BalanceDetailComponent implements OnInit {
    @Input() public balanceId: number;
    public pockets$: Observable<Pocket[]>;

    constructor(
        private pocketService: PocketService) {
    }

    public ngOnInit(): void {
        this.pockets$ = this.pocketService.query({'balanceId.in': this.balanceId})
            .pipe(map((response) => response.body));
    }
}
