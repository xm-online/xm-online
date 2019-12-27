import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Principal} from '../../../shared/auth/principal.service';

@Component({
    selector: 'xm-no-data, no-data',
    templateUrl: './no-data.component.html',
    styles: [`
        :host-context {
            display: block;
            text-align: center;
        }
        p {
            margin: 20px 0 0;
        }
    `],
})
export class NoDataComponent implements OnChanges {

    @Input() public show: any;
    @Input() public text: any;
    @Input() public hideImage: boolean = false;

    constructor(public principal: Principal) { }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!changes.text || !changes.text.currentValue) {
            this.text = 'global.noData';
        }
    }

}
