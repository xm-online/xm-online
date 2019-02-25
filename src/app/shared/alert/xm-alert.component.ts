import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';

declare let $: any;

/**
 * Alerts can be used to provide feedback messages.
 */
@Component({
    selector: 'xm-alert',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ``
})
export class XmAlertComponent implements OnInit {

    @Input() dismissible: boolean;
    @Input() type: string;
    @Input() message: string;
    @Output() close = new EventEmitter();

    constructor(config: NgbAlertConfig) {
        this.dismissible = config.dismissible;
        this.type = config.type;
    }

    ngOnInit() {
        if (this.message) {
            this.showAlert(this.type, this.message);
        }
    }

    showAlert(type, message) {
        $.notify({
            icon: 'add',
            message: message

        }, {
            type: type,
            timer: 5000,
            z_index: 2000,
            placement: {
                from: 'top',
                align: 'right'
            }
        });
    }
}
