import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { I18nNamePipe, JhiLanguageHelper, Principal } from '../../shared';
import { Spec, XmEntitySpecWrapperService } from '../../xm-entity';
import { Dashboard, DashboardService, DashboardWrapperService, Widget } from '../';
import { XmConfigService } from '../../shared/spec/config.service';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'xm-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

    // Back compatibility matrix
    private mapWidgets = {
        'xm-widget-available-offerings': 'ext-common-entity/xm-widget-available-offerings',
        'xm-widget-clock': 'ext-common/xm-widget-clock',
        'xm-widget-general-countries': 'ext-common-entity/xm-widget-general-countries',
        'xm-widget-general-map': 'ext-common-entity/xm-widget-general-map',
        'xm-widget-stats': 'ext-common-entity/xm-widget-stats',
        'xm-widget-chartist-line': 'ext-common-entity/xm-widget-chartist-line',
        'xm-widget-tasks': 'ext-common-entity/xm-widget-tasks',
        'xm-widget-weather': 'ext-common/xm-widget-weather',
        'xm-widget-exchange-calculator': 'ext-common/xm-widget-exchange-calculator',
        'xm-widget-md': 'ext-common/xm-widget-md',
        'xm-widget-lots': 'ext-auction/xm-widget-lots',
        'xm-widget-welcome': 'ext-common/xm-widget-welcome',
        'xm-widget-entities-list': 'ext-common-entity/xm-widget-entities-list',
        'xm-widget-sign-in-up': 'ext-common/xm-widget-sign-in-up',
        'xm-widget-iframe': 'ext-common/xm-widget-iframe',
        'xm-widget-provide-customer-info': 'ext-common-entity/xm-widget-provide-customer-info',
        'xm-widget-coin-account': 'ext-crypto-wallet/xm-widget-coin-account',
        'xm-widget-coin-wallets': 'ext-crypto-wallet/xm-widget-coin-wallets',
        'xm-widget-jbs-board': 'ext-tenant-jsales/xm-jbs-board-widget',
        'xm-widget-zendesk-tickets': 'ext-zendesk/xm-widget-zendesk-tickets',
        'xm-widget-coin-wallet-escrow': 'ext-crypto-wallet/xm-widget-coin-wallet-escrow',
        'xm-widget-news': 'ext-common/xm-widget-news',
        'xm-widget-ico': 'ext-ico/xm-widget-ico'
    };

    private routeData: any;
    private routeSubscription: any;
    private routeDataSubscription: any;

    dashboard: Dashboard = new Dashboard();
    showLoader: boolean;
    spec: Spec;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private jhiLanguageHelper: JhiLanguageHelper,
                private dashboardService: DashboardService,
                private dashboardWrapperService: DashboardWrapperService,
                private xmEntitySpecWrapperService: XmEntitySpecWrapperService,
                private principal: Principal,
                private xmConfigService: XmConfigService,
                private i18nNamePipe: I18nNamePipe) {
    }

    ngOnInit() {
        this.xmEntitySpecWrapperService.spec().then((spec) => this.spec = spec);
        this.routeDataSubscription = this.route.data.subscribe(data => {
            this.routeData = data;
        });
        this.routeSubscription = this.route.params.subscribe(params => {
            if (params.id) {
                this.load(params.id);
            } else {
                this.rootRedirect();
            }
        });

    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
        this.routeDataSubscription.unsubscribe();
    }

    rootRedirect() {
        this.principal.identity().then(() =>
            this.principal.hasPrivileges(['DASHBOARD.GET_LIST']).then(result => {
                if (result) {
                    this.xmConfigService.getUiConfig().subscribe(config => {
                        if ('defaultDashboard' in config && config.defaultDashboard.length) {
                            if (typeof config.defaultDashboard === 'string') {
                                const slugs = [];
                                slugs.push(config.defaultDashboard);
                                this.checkAndRedirect(slugs);
                            } else {
                                this.checkAndRedirect(config.defaultDashboard);
                            }
                        } else {
                            if (!environment.production) {console.log(`rootRedirect`)}
                            this.dashboardWrapperService.dashboards().then((dashboards) => {
                                    if (dashboards && dashboards.length && dashboards[0].id) {
                                        const key = dashboards[0].config && dashboards[0].config.slug
                                            ? dashboards[0].config.slug : dashboards[0].id;
                                        this.router.navigate([`/dashboard`, key]);
                                    }
                                }
                            );
                        }
                    });
                }
            })
        );
    }

    load(idOrSlug) {
        this.showLoader = true;
        if (!environment.production) {console.log(`load ${idOrSlug}`)}
        this.dashboardWrapperService.dashboards().then((dashboards) => {
                if (dashboards && dashboards.length) {
                    this.dashboard = dashboards.filter((d) => (d.config && d.config.slug === idOrSlug)
                        || d.id === parseInt(idOrSlug, 10)).shift();
                    // TODO temporary fix for override widget variables
                    this.dashboard =  JSON.parse(JSON.stringify(this.dashboard || ''));
                    if (this.dashboard && this.dashboard.id) {
                        this.loadDashboard(this.dashboard.id);
                    } else {
                        console.log('No dashboard found by %s', idOrSlug);
                        this.rootRedirect();
                    }
                }
            }
        );
    }

    loadDashboard(id) {
        if (!environment.production) {console.log(`load dashboard ${id}`)}

        this.dashboardService.find(id).subscribe(result => {
                const widgets =
                    (result.body && result.body.widgets ? result.body.widgets : [])
                        .sort((a, b) => this.sortByOrderIndex(a, b));
                Object.assign(this.dashboard, {
                    widgets: this.getWidgetComponent(widgets)
                });

                if (this.dashboard.layout && this.dashboard.layout.layout) {
                    this.dashboard.layout.grid = this.dashboard.layout.layout.map(row => {
                        row.content = row.content.map(el => {
                            // TODO FIXME override id by widget object
                            // TODO when page open next time, inside el.widget not id (object widget),
                            // and <widget.id === el.widget> not work;
                            el.widget = widgets.find(widget => {
                                return widget.id === el.widget;
                            });
                            return el;
                        });
                        return row;
                    });
                } else {
                    this.dashboard.layout = {};
                    this.dashboard.layout.grid = widgets.map(el => this.defaultGrid(el));
                }
                this.routeData.pageSubSubTitle = this.processDashboardName(this.dashboard);
                this.jhiLanguageHelper.updateTitle();
            },
            () => {
                console.log('No dashboard found by %s', id);
                this.showLoader = false;
            },
            () => (this.showLoader = false)
        );
    }

    private processDashboardName(dashboard: any): string {
        const config = dashboard && dashboard.config || {};
        const dashboardName = config.name ? this.i18nNamePipe.transform(config.name, this.principal) : null;
        const dashboardMenuLabel = (config.menu && config.menu.name)
            ? this.i18nNamePipe.transform(config.menu.name, this.principal)
            : this.dashboard.name;
        return dashboardName || dashboardMenuLabel;
    }

    private defaultGrid(el: Widget) {
        return {
            class: 'row',
            content: [
                {
                    class: 'col-sm-12',
                    widget: el
                }
            ]
        };
    }

    private checkAndRedirect(slugs: any[]): void {
        const configSlugs = slugs instanceof Array ? slugs : [];
        let slugToGo = null;
        if (!environment.production) {console.log(`checkAndRedirect`)}
        this.dashboardWrapperService.dashboards().then((dashboards) => {
            configSlugs.forEach((slug, i) => {
                if (dashboards && dashboards.length) {
                    for (const d of dashboards) {
                        const dSlug = d && d.config && d.config.slug ? d.config.slug : null;
                        if (dSlug === slug) {
                            slugToGo = slug;
                            break;
                        }
                    }
                }
            });

            if (slugToGo) {
                this.router.navigate([`/dashboard`, slugToGo]);
            } else {
                if (dashboards && dashboards.length && dashboards[0].id) {
                    const key = dashboards[0].config && dashboards[0].config.slug
                        ? dashboards[0].config.slug : dashboards[0].id;
                    this.router.navigate([`/dashboard`, key]);
                }
            }
        });
    }

    private getWidgetComponent(widgets: Widget[]): Widget[] {
        return widgets.map(widget => {
            if (typeof this.mapWidgets[widget.selector] === 'string' || this.mapWidgets[widget.selector] instanceof String) {
                widget.selector = this.mapWidgets[widget.selector];
            } else {
                widget.component = this.mapWidgets[widget.selector];
            }
            if (widget.selector.indexOf('/') > 0) {
                widget.module = widget.selector.split('/')[0];
                widget.selector = widget.selector.split('/')[1];
            }
            widget.config = widget.config || {};
            Object.assign(widget.config, {id: widget.id, name: widget.name});
            return widget;
        });
    }

    /**
     * Sort widgets by optional orderIndex field in widget.config
     * @param itemA
     * @param itemB
     */
    private sortByOrderIndex(itemA: Widget, itemB: Widget): number {
        const aIndex = this.getOrderIndex(itemA.config ? itemA.config : {});
        const bIndex = this.getOrderIndex(itemB.config ? itemB.config : {});
        if (aIndex > bIndex) {
            return 1
        }
        if (aIndex < bIndex) {
            return -1
        }
        return 0;
    }

    private getOrderIndex({orderIndex = 100}: {orderIndex: number}): number {
        return orderIndex;
    }
}

