import {Component} from '@angular/core';
import {UseGlobalTranslations} from "../../shared/language/use.global.location";
import {JhiLanguageService} from "ng-jhipster";

@Component({
    selector: 'xm-sign-up',
    templateUrl: './sign-up.component.html'
})
export class SignUpComponent {

    constructor(private jhiLanguageService: JhiLanguageService) {
        this.jhiLanguageService.addLocation('register');
    }
}
