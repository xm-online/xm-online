import { Component, OnInit } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';
import { ModulesLanguageHelper } from '../../../shared/language/modules-language.helper';

@Component({
    selector: 'xm-welcome-widget',
    templateUrl: './welcome-widget.component.html',
    styleUrls: ['./welcome-widget.component.scss']
})
export class WelcomeWidgetComponent implements OnInit {

    config: any;

    constructor( private jhiLanguageService: JhiLanguageService,
                 private modulesLangHelper: ModulesLanguageHelper) {
    }

    ngOnInit() {
        this.jhiLanguageService.changeLanguage(this.modulesLangHelper.getLangKey());
    }

}
