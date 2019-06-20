import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ModulesLanguageHelper } from '../../../shared/language/modules-language.helper';
import { XM_EVENT_LIST } from '../../../xm.constants';
import { XmConfigService } from '../../../shared';

@Component({
    selector: 'xm-sign-in-up-widget',
    templateUrl: './sign-in-up-widget.component.html',
    styleUrls: ['./sign-in-up-widget.component.scss']
})
export class SignInUpWidgetComponent implements OnInit, OnDestroy {

    private registrationSuccessSubscription: Subscription;
    private changeLanguageSubscriber: Subscription;

    config: any;
    isLoginFormView = true;
    successRegistration = false;
    socialConfiguration: any;
    loginLabel: string;

    constructor(
        private eventManager: JhiEventManager,
        private translateService: TranslateService,
        private jhiLanguageService: JhiLanguageService,
        private modulesLangHelper: ModulesLanguageHelper,
        private xmConfigService: XmConfigService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {
        this.jhiLanguageService.changeLanguage(this.modulesLangHelper.getLangKey());
        this.registrationSuccessSubscription = this.eventManager.subscribe(XM_EVENT_LIST.XM_REGISTRATION, () => {
            this.isLoginFormView = true;
            this.successRegistration = true;
        });

        this.changeLanguageSubscriber = this.eventManager.subscribe(XM_EVENT_LIST.XM_CHANGE_LANGUAGE, (event) => {
            this.jhiLanguageService.changeLanguage(event.content);
            if (this.config && this.config.loginLabel) {
                this.updateLabels(this.config.loginLabel, event.content);
            }
        });

        this.route.queryParams.subscribe(params => {
            if (params['type']) {
                this.isLoginFormView = !(params['type'] === 'registration');
            }
        });
        if (this.config && this.config.loginLabel) {
            this.updateLabels(this.config.loginLabel);
        }
    }

    ngOnDestroy() {
        this.registrationSuccessSubscription.unsubscribe();
        this.changeLanguageSubscriber.unsubscribe();
    }

    changeMode() {
        this.isLoginFormView = !this.isLoginFormView;
        this.successRegistration = false;

        this.router.navigate(['.'], {
            queryParams: {}
        });
    }

    private updateLabels(label: any, currentLang?: string) {
        const lang = currentLang ? currentLang : this.modulesLangHelper.getLangKey();
        this.loginLabel = label[lang] || label;
    }
}
