import { Component } from '@angular/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmToasterService } from '@xm-ngx/toaster';

import { XmConfigService } from '../../shared/spec/config.service';

@Component({
    selector: 'xm-maintenance',
    templateUrl: './maintenance.component.html',
    styles: [],
})
export class MaintenanceComponent {

    public isTenantCfgUpdating: boolean;

    constructor(
        private service: XmConfigService,
        private alertService: XmAlertService,
        private toasterService: XmToasterService,
    ) {
    }

    public reindexElastic(): void {
        this.alertService.open({
            title: 'Warning. Elastic index will be re-indexed. Time consuming operation.',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes, reindex!',
        }).subscribe((result) => {
            if (result.value) {
                this.service.reindexTenantElastic().subscribe(
                    null,
                    null,
                    () => this.toasterService.success('global.actionPerformed'),
                );
            }
        });
    }

    public updateTenantsConfiguration(): void {

        this.alertService.open({
            title: 'Reload configuration for ALL tenants?',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes, reload!',
        }).subscribe((result) => {
            if (result.value) {
                this.service.updateTenantsConfig().subscribe(
                    null,
                    null,
                    () => {
                        this.toasterService.success('global.actionPerformed');
                        window.location.reload();
                    },
                );
            }
        });

    }

    public updateTenantConfiguration(): void {
        this.alertService.open({
            title: 'Reload tenant configuration?',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes, reload!',
        }).subscribe((result) => {
            this.isTenantCfgUpdating = true;
            if (result.value) {
                this.service.updateTenantConfig().subscribe(
                    null,
                    null,
                    () => {
                        this.isTenantCfgUpdating = false;
                        this.toasterService.success('global.actionPerformed');
                        window.location.reload();
                    });
            }
        });
    }

}
