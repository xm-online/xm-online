import {Component, OnInit} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {EventManager, JhiLanguageService} from 'ng-jhipster';
import {Http, Headers, URLSearchParams} from '@angular/http';

import {Account, Principal} from '../shared';
import {Widget} from "../entities/widget/widget.model";

import {
    XmWidgetAvailableOfferingsComponent,
    XmWidgetGeneralMapComponent,
    XmWidgetStatsComponent,
    XmWidgetTasksComponent,
    XmWidgetWeatherComponent,
    XmWidgetClockComponent,
    XmWidgetGeneralCountriesComponent,
    XmWidgetMttEarthComponent,
    XmWidgetExchangeComponent,
    XmWidgetMdComponent,
    XmWidgetActiveCallsComponent,
    XmWidgetLotsComponent,
    XmWidgetWelcomeComponent,
    XmWidgetEntitiesListComponent,
} from '../dashboard';
import {XmConfigService} from "../admin/configuration/config.service";
import {Observable} from "rxjs/Observable";
import {AuthServerProvider} from "../shared/auth/auth-jwt.service";


@Component({
    selector: 'xm-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    account: Account;
    modalRef: NgbModalRef;
    isLoginFormView: boolean;
    defaultWidget: Widget;


    constructor(
        private jhiLanguageService: JhiLanguageService,
        private principal: Principal,
        private eventManager: EventManager,
        private xmConfigService: XmConfigService,
        private http: Http,
        private authServerProvider: AuthServerProvider,
    ) {
        this.jhiLanguageService.setLocations(['home', 'register', 'login']);
        this.isLoginFormView = true;
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();

        Observable.forkJoin([
            this.xmConfigService.getUiConfig(),
            this.getAccessToken()
        ])
            .subscribe(
                result => this.defaultWidget = this.getWidgetComponent(result[0].defaultWidget),
                () => this.defaultWidget = this.getWidgetComponent()
            );
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    changeMode() {
        this.isLoginFormView = !this.isLoginFormView;
    }

    private getAccessToken() {
        const data = new URLSearchParams('grant_type=client_credentials'),
            headers: Headers = new Headers ({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic aW50ZXJuYWw6aW50ZXJuYWw=',
            })
        ;
        return this.http.post('uaa/oauth/token', data, {headers})
            .map((resp) => {
                this.authServerProvider.loginWithToken(resp.json().access_token, false);
            });
    }

    private getWidgetComponent (widget: Widget = {}): Widget {
        const mapComponents = {
            'xm-widget-available-offerings': XmWidgetAvailableOfferingsComponent,
            'xm-widget-clock': XmWidgetClockComponent,
            'xm-widget-general-countries': XmWidgetGeneralCountriesComponent,
            'xm-widget-general-map': XmWidgetGeneralMapComponent,
            'xm-widget-mtt-earth': XmWidgetMttEarthComponent,
            'xm-widget-stats': XmWidgetStatsComponent,
            'xm-widget-tasks': XmWidgetTasksComponent,
            'xm-widget-weather': XmWidgetWeatherComponent,
            'xm-widget-exchange-calculator': XmWidgetExchangeComponent,
            'xm-widget-md': XmWidgetMdComponent,
            'xm-widget-active-calls': XmWidgetActiveCallsComponent,
            'xm-widget-lots': XmWidgetLotsComponent,
            'xm-widget-welcome': XmWidgetWelcomeComponent,
            'xm-widget-entities-list': XmWidgetEntitiesListComponent,
        };
        widget.component = mapComponents[widget.selector] || XmWidgetWelcomeComponent;
        widget.config = widget.config || {};
        Object.assign(widget.config, {
            id: widget.id,
            name: widget.name
        });
        return widget;
    }

}
