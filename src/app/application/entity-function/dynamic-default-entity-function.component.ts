import {Component, Injector} from "@angular/core";

@Component({
    selector: 'xm-default-function-cmp',
    template: `<div>Function not defined!</div>`
})
export class EntityDefaultFunctionComponent {

    config: any;

    constructor(
        private injector: Injector
    ) {
        this.config = this.injector.get('config') || {};
    }

}