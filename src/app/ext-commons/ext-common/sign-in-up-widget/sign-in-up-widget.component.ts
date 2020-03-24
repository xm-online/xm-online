import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { XmEventManager } from '@xm-ngx/core';
import { Subscription } from 'rxjs';

import { ModulesLanguageHelper } from '@xm-ngx/components/language';
import { XM_EVENT_LIST } from '../../../xm.constants';

@Component({
    selector: 'xm-sign-in-up-widget',
    templateUrl: './sign-in-up-widget.component.html',
    styleUrls: ['./sign-in-up-widget.component.scss'],
})
export class SignInUpWidgetComponent implements OnInit, OnDestroy {

    public config: any;
    public isLoginFormView: boolean = true;
    public successRegistration: boolean = false;
    public loginLabel: string;
    private registrationSuccessSubscription: Subscription;
    private changeLanguageSubscriber: Subscription;

    constructor(
        private eventManager: XmEventManager,
        private modulesLangHelper: ModulesLanguageHelper,
        private route: ActivatedRoute,
        private router: Router) {
    }

    public ngOnInit(): void {
        this.registrationSuccessSubscription = this.eventManager.subscribe(XM_EVENT_LIST.XM_REGISTRATION, () => {
            this.isLoginFormView = true;
            this.successRegistration = true;
        });

        this.changeLanguageSubscriber = this.eventManager.subscribe(XM_EVENT_LIST.XM_CHANGE_LANGUAGE, (event) => {
            if (this.config && this.config.loginLabel) {
                this.updateLabels(this.config.loginLabel, event.content);
            }
        });

        this.route.queryParams.subscribe((params) => {
            if (params.type) {
                this.isLoginFormView = (params.type !== 'registration');
            }
        });
        if (this.config && this.config.loginLabel) {
            this.updateLabels(this.config.loginLabel);
        }
    }

    public ngOnDestroy(): void {
        this.registrationSuccessSubscription.unsubscribe();
        this.changeLanguageSubscriber.unsubscribe();
    }

    public changeMode(): void {
        this.isLoginFormView = !this.isLoginFormView;
        this.successRegistration = false;

        this.router.navigate(['.'], {
            queryParams: {},
        });
    }

    private updateLabels(label: any, currentLang?: string): void {
        const lang = currentLang ? currentLang : this.modulesLangHelper.getLangKey();
        this.loginLabel = label[lang] || label;
    }
}
