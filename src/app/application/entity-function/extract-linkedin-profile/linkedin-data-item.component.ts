import {Component, Input} from '@angular/core';
import {JhiLanguageService} from "ng-jhipster";

@Component({
    selector: 'xm-linkedin-data-item',
    templateUrl: './linkedin-data-item.component.html'
})
export class LinkedinDataItemComponent {

    @Input()
    private dataItem: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
    ) {
        this.jhiLanguageService.addLocation('function-linkedin');
    }

}
