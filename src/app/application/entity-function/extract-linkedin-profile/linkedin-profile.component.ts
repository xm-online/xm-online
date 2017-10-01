import {Component, Injector} from '@angular/core';
import {UseGlobalTranslations} from "../../../shared/language/use.global.location";
import {JhiLanguageService} from "ng-jhipster";

@Component({
    selector: 'xm-linkedin-profile',
    templateUrl: './linkedin-profile.component.html'
})
export class LinkedinProfileComponent {

    profile: any;
    private config: any;

    constructor(
        private injector: Injector,
        private jhiLanguageService: JhiLanguageService
    ) {
        this.config = this.injector.get('config') || {};
        this.profile = this.config.func && this.config.func.data;
        this.jhiLanguageService.addLocation('function-linkedin');
        this.jhiLanguageService.addLocation('xmEntity');
    }

}
