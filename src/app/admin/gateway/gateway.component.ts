import { Component, OnInit } from '@angular/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmToasterService } from '@xm-ngx/toaster';
import { finalize } from 'rxjs/operators';

import { XmConfigService } from '../../shared/spec/config.service';
import { GatewayRoute } from './gateway-route.model';

import { GatewayRoutesService } from './gateway-routes.service';

@Component({
    selector: 'xm-gateway',
    templateUrl: './gateway.component.html',
    providers: [GatewayRoutesService],
})
export class JhiGatewayComponent implements OnInit {

    public gatewayRoutes: GatewayRoute[];
    public showLoader: boolean;

    constructor(
        private gatewayRoutesService: GatewayRoutesService,
        private service: XmConfigService,
        private alertService: XmAlertService,
        private toasterService: XmToasterService,
    ) {
    }

    public ngOnInit(): void {
        this.refresh();
    }

    public refresh(): void {
        this.showLoader = true;
        this.gatewayRoutesService
            .findAll()
            .subscribe((gatewayRoutes) => this.gatewayRoutes = gatewayRoutes,
                (err) => console.warn(err),
                () => this.showLoader = false);
    }

    public tenantConfigRefresh(): void {
        this.alertService.open({
            title: 'Reload tenant configuration?',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes, reload!',
        }).subscribe((result) => result.value ? this.triggerUpdate()
            : console.info('Cancel'));
    }

    public tenantElasticUpdate(): void {
        this.alertService.open({
            title: 'Reload Elastic?',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes, reload!',
        }).subscribe((result) => result.value ? this.triggerUpdate('reindexTenantElastic')
            : console.info('Cancel'));
    }

    private triggerUpdate(type: 'updateTenantConfig' | 'reindexTenantElastic' = 'updateTenantConfig'): void {
        this.showLoader = true;
        this.service[type]().pipe(finalize(() => this.showLoader = false)).subscribe(
            (resp) => console.warn(resp),
            (err) => {
                console.warn(err);
                this.showLoader = false;
            },
            () => this.toasterService.success('global.actionPerformed'));
    }

}
