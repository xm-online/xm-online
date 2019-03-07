import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { GatewayRoutesService } from './gateway-routes.service';
import { GatewayRoute } from './gateway-route.model';
import swal from 'sweetalert2';
import {XmConfigService} from '../../shared/spec/config.service';
import {JhiAlertService} from 'ng-jhipster';

@Component({
    selector: 'xm-gateway',
    templateUrl: './gateway.component.html',
    providers: [ GatewayRoutesService ]
})
export class JhiGatewayComponent implements OnInit {

    gatewayRoutes: GatewayRoute[];
    showLoader: boolean;

    constructor(
        private gatewayRoutesService: GatewayRoutesService,
        private service: XmConfigService,
        private alertService: JhiAlertService
    ) {
    }

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.showLoader = true;
        this.gatewayRoutesService
            .findAll()
            .subscribe(gatewayRoutes => this.gatewayRoutes = gatewayRoutes,
                (err) => console.log(err),
                () => this.showLoader = false);
    }

    private triggerUpdate(type: 'updateTenantConfig' | 'reindexTenantElastic' = 'updateTenantConfig') {
        this.showLoader = true;
        this.service[type]().pipe(finalize(() => this.showLoader = false)).subscribe(
            (resp) => console.log(resp),
            (err) => {console.log(err); this.showLoader = false},
            () => this.alertService.success('global.actionPerformed'));
    }

    tenantConfigRefresh() {
        swal({
            title: 'Reload tenant configuration?',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-raised-button btn-primary',
            cancelButtonClass: 'btn mat-raised-button',
            confirmButtonText: 'Yes, reload!'
        }).then((result) => result.value  ? this.triggerUpdate()
            : console.log('Cancel'));
    }

    tenantElasticUpdate() {
        swal({
            title: 'Reload Elastic?',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-raised-button btn-primary',
            cancelButtonClass: 'btn mat-raised-button',
            confirmButtonText: 'Yes, reload!'
        }).then((result) => result.value  ? this.triggerUpdate('reindexTenantElastic')
            : console.log('Cancel'));
    }

}
