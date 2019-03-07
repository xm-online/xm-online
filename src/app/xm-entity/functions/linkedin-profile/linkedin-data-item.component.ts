import { Component, Input } from '@angular/core';

@Component({
    selector: 'xm-linkedin-data-item',
    templateUrl: './linkedin-data-item.component.html',
    styleUrls: ['./linkedin-data-item.component.scss']
})
export class LinkedinDataItemComponent {

    @Input() dataItem: any;

    constructor() {
    }

}
