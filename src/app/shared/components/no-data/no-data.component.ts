import {Component, Input} from '@angular/core';

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
export class NoDataComponent {

    @Input() show: any;
    @Input() text: any;
    @Input() hideImage = false;

    constructor() { }

}
