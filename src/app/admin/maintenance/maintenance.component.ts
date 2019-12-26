import { Component, OnInit } from '@angular/core';
import { JhiAlertService } from 'ng-jhipster';

import swal from 'sweetalert2';
import { XmConfigService } from '../../shared/spec/config.service';

@Component({
    selector: 'xm-maintenance',
    templateUrl: './maintenance.component.html',
    styles: [],
})
export class MaintenanceComponent implements OnInit {

    public isTenantCfgUpdating: boolean;

    constructor(
        private service: XmConfigService,
        private alertService: JhiAlertService,
    ) {
    }

    public ngOnInit(): void {
    }

    public reindexElastic(): void {
        swal({
            title: 'Warning. Elastic index will be re-indexed. Time consuming operation.',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-raised-button btn-primary',
            cancelButtonClass: 'btn mat-raised-button',
            confirmButtonText: 'Yes, reindex!',
        }).then((result) => result.value ? this.service.reindexTenantElastic().subscribe(
            (resp) => console.log(resp),
            (err) => console.log(err),
            () => this.alertService.success('global.actionPerformed'),
        ) : console.log('Cancel'));
    }

    public updateTenantsConfiguration(): void {

        swal({
            title: 'Reload configuration for ALL tenants?',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-raised-button btn-primary',
            cancelButtonClass: 'btn mat-raised-button',
            confirmButtonText: 'Yes, reload!',
        }).then((result) => result.value ? this.service.updateTenantsConfig().subscribe(
            (resp) => console.log(resp),
            (err) => console.log(err),
            () => {
                this.alertService.success('global.actionPerformed');
                window.location.reload();
            },
        ) : console.log('Cancel'));

    }

    public updateTenantConfiguration(): void {
        swal({
            title: 'Reload tenant configuration?',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-raised-button btn-primary',
            cancelButtonClass: 'btn mat-raised-button',
            confirmButtonText: 'Yes, reload!',
        }).then((result) => {
            this.isTenantCfgUpdating = true;
            result.value ? this.service.updateTenantConfig().subscribe(
                (resp) => console.log(resp),
                (err) => console.log(err),
                () => {
                    this.isTenantCfgUpdating = false;
                    this.alertService.success('global.actionPerformed');
                    window.location.reload();
                })
                : console.log('Cancel');
        });
    }

}
