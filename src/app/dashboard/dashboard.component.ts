import { Component, OnInit, AfterViewInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {Dashboard} from '../entities/dashboard/dashboard.model';
import {Widget} from '../entities/widget/widget.model';

import { DashboardService } from '../entities/dashboard/dashboard.service';
import {JhiLanguageService} from 'ng-jhipster';
import {JhiLanguageHelper} from '../shared/language/language.helper';

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
} from './';

declare let $:any;

@Component({
    selector: 'xm-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit {

    dashboard: Dashboard = new Dashboard;
    private routeData: any;
    private routeSubscription: any;
    private routeDataSubscription: any;

    constructor(
        private route: ActivatedRoute,
        private jhiLanguageHelper: JhiLanguageHelper,
        private jhiLanguageService: JhiLanguageService,
        private dashboardService: DashboardService,
    ) {
        this.jhiLanguageService.addLocation('dashboard');
    }

    public ngOnInit() {
        this.routeSubscription = this.route.params.subscribe((params) => {
            this.loadDashboard(params.id);
        });
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.routeData = data;
        });
    }

    ngAfterViewInit(){
    }

    loadDashboard(id) {
        Observable.forkJoin([
            this.dashboardService.find(id),
            this.dashboardService.getWidgets(id)
        ])
            .subscribe(result => {
                let widgets = result[1] || [];
                result[0] && Object.assign(this.dashboard, result[0]);
                Object.assign(this.dashboard, {widgets: this.getWidgetComponent(widgets)});

                if (this.dashboard.layout && this.dashboard.layout.layout) {
                    this.dashboard.layout = this.dashboard.layout.layout.map(row => {
                        row.content = row.content.map(el => {
                            el.widget = widgets.find( widget => widget.id == el.widget);
                            return el;
                        });
                        return row;
                    });
                } else {
                    this.dashboard.layout = widgets.map(el => {
                        return {
                            class: 'row',
                            content: [{
                                class: 'col-sm-12',
                                widget: el
                            }]
                        }
                    });
                }

                this.routeData.pageSubSubTitle = this.dashboard.name;
                this.jhiLanguageHelper.updateTitle();
            })
        ;
    }

    private getWidgetComponent (widgets: Widget[]): Widget[] {
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
        return widgets.map(widget => {
            widget.component = mapComponents[widget.selector];
            widget.config = widget.config || {};
            Object.assign(widget.config, {
                id: widget.id,
                name: widget.name
            });
            return widget;
        });
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
        this.routeDataSubscription.unsubscribe();
    }

}
