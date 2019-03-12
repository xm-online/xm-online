import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';

import { Principal } from '../../../shared/auth/principal.service';
import { Dashboard, DashboardService } from '../../../xm-dashboard';
import { environment } from '../../../../environments/environment';

declare let swal: any;

@Component({
  selector: 'xm-dashboard-detail-dialog',
  templateUrl: './dashboard-detail-dialog.component.html',
  styleUrls: ['./dashboard-detail-dialog.component.scss']
})
export class DashboardDetailDialogComponent implements OnInit {

    @Input() dashboard: Dashboard = new Dashboard();

    configStringIn: string;
    configStringOut: string;
    layoutStringIn: string;
    layoutStringOut: string;
    showLoader: boolean;

    constructor(private activeModal: NgbActiveModal,
                private dashboardService: DashboardService,
                private eventManager: JhiEventManager,
                private translateService: TranslateService,
                public principal: Principal) {
    }

    ngOnInit() {
        this.configStringIn = JSON.stringify(this.dashboard.config, null, 2);
        this.layoutStringIn = JSON.stringify(this.dashboard.layout, null, 2);
        this.configStringOut = this.configStringIn;
        this.layoutStringOut = this.layoutStringIn;
    }

    onConfigChange(textChanged) {
        if (!environment.production) {
            console.log(`Changed text ${textChanged}`);
        }
        this.configStringOut = textChanged;
    }

    onLayoutChange(textChanged) {
        this.layoutStringOut = textChanged;
    }

    onConfirmSave() {
        this.dashboard.config = this.configStringOut ? JSON.parse(this.configStringOut) : null;
        this.dashboard.layout = this.layoutStringOut ? JSON.parse(this.layoutStringOut) : null;
        this.showLoader = true;
        if (this.dashboard.id !== undefined) {
            this.dashboardService.update(this.dashboard).subscribe(
                () => this.onSaveSuccess('admin-config.dashboard-detail-dialog.edit.success'),
                // TODO: error processing
                (err) => console.log(err),
                () => this.showLoader = false);
        } else {
            this.dashboard.owner = this.principal.getUserKey();
            this.dashboardService.create(this.dashboard).subscribe(
                () => this.onSaveSuccess('admin-config.dashboard-detail-dialog.add.success'),
                // TODO: error processing
                (err) => console.log(err),
                () => this.showLoader = false);
        }
    }

    private onSaveSuccess(key: string) {
        // TODO: use constant for the broadcast and analyse listeners
        this.eventManager.broadcast({name: 'dashboardListModification'});
        this.activeModal.dismiss(true);
        this.alert('success', key);
    }

    onCancel() {
        this.activeModal.dismiss('cancel');
    }

    private alert(type, key) {
        swal({
            type: type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary'
        });
    }

}
