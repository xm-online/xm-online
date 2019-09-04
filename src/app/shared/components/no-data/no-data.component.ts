import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Principal} from '../../../shared/auth/principal.service';

@Component({
    selector: 'no-data',
    templateUrl: './no-data.component.html',
    styles: [`
        :host-context {
            display: block;
            text-align: center;
        }
        p {
            margin: 20px 0 0;
        }
    `]
})
export class NoDataComponent implements OnChanges {

    @Input() show: any;
    @Input() text: any;
    @Input() hideImage = false;

    constructor(public principal: Principal) { }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.text || !changes.text.currentValue) {
            this.text = {trKey : 'global.noData'};
        }
    }

}
