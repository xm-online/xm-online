import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';

import { Principal } from '../../../shared/auth/principal.service';
import { Widget, WidgetService } from '../../../xm-dashboard';

declare let swal: any;

@Component({
    selector: 'xm-widget-detail-dialog',
    templateUrl: './widget-detail-dialog.component.html',
    styleUrls: ['./widget-detail-dialog.component.scss'],
})
export class WidgetDetailDialogComponent implements OnInit {

    @Input() public dashboardId: number;
    @Input() public widget: Widget = new Widget();

    public configStringIn: string;
    public configStringOut: string;
    public showLoader: boolean;

    constructor(private activeModal: NgbActiveModal,
                private widgetService: WidgetService,
                private eventManager: JhiEventManager,
                private translateService: TranslateService,
                public principal: Principal) {
    }

    public ngOnInit(): void {
        this.configStringIn = JSON.stringify(this.widget.config, null, 2);
        this.configStringOut = this.configStringIn;
    }

    public onConfigChange(textChanged: any): void {
        this.configStringOut = textChanged;
    }

    public onConfirmSave(): void {
        this.widget.dashboard = {id: this.dashboardId};
        this.widget.config = this.configStringOut ? JSON.parse(this.configStringOut) : null;

        this.showLoader = true;
        if (this.widget.id !== undefined) {
            this.widgetService.update(this.widget).subscribe(
                () => this.onSaveSuccess('admin-config.widget-detail-dialog.edit.success'),
                // TODO: error processing
                (err) => console.warn(err),
                () => this.showLoader = false);
        } else {
            this.widgetService.create(this.widget).subscribe(
                () => this.onSaveSuccess('admin-config.widget-detail-dialog.add.success'),
                // TODO: error processing
                (err) => console.warn(err),
                () => this.showLoader = false);
        }
    }

    public onCancel(): void {
        this.activeModal.dismiss('cancel');
    }

    private onSaveSuccess(key: string): void {
        // TODO: use constant for the broadcast and analyse listeners
        this.eventManager.broadcast({name: 'widgetListModification'});
        this.activeModal.dismiss(true);
        this.alert('success', key);
    }

    private alert(type: string, key: string): void {
        swal({
            type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary',
        });
    }

}
