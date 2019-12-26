import { Component, OnInit } from '@angular/core';
import { JhiAlertService } from 'ng-jhipster';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
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
        private alertService: JhiAlertService,
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
                (err) => console.log(err),
                () => this.showLoader = false);
    }

    public tenantConfigRefresh(): void {
        swal({
            title: 'Reload tenant configuration?',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-raised-button btn-primary',
            cancelButtonClass: 'btn mat-raised-button',
            confirmButtonText: 'Yes, reload!',
        }).then((result) => result.value ? this.triggerUpdate()
            : console.log('Cancel'));
    }

    public tenantElasticUpdate(): void {
        swal({
            title: 'Reload Elastic?',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-raised-button btn-primary',
            cancelButtonClass: 'btn mat-raised-button',
            confirmButtonText: 'Yes, reload!',
        }).then((result) => result.value ? this.triggerUpdate('reindexTenantElastic')
            : console.log('Cancel'));
    }

    private triggerUpdate(type: 'updateTenantConfig' | 'reindexTenantElastic' = 'updateTenantConfig'): void {
        this.showLoader = true;
        this.service[type]().pipe(finalize(() => this.showLoader = false)).subscribe(
            (resp) => console.log(resp),
            (err) => {
                console.log(err);
                this.showLoader = false;
            },
            () => this.alertService.success('global.actionPerformed'));
    }

}
