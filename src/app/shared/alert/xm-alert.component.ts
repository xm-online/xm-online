import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';

declare let $: any;

/**
 * Alerts can be used to provide feedback messages.
 */
@Component({
    selector: 'xm-alert',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ``,
})
export class XmAlertComponent implements OnInit {

    @Input() public dismissible: boolean;
    @Input() public type: string;
    @Input() public message: string;
    @Output() public close = new EventEmitter();

    constructor(config: NgbAlertConfig) {
        this.dismissible = config.dismissible;
        this.type = config.type;
    }

    public ngOnInit(): void {
        if (this.message) {
            this.showAlert(this.type, this.message);
        }
    }

    public showAlert(type, message): void {
        $.notify({
            icon: 'add',
            message,

        }, {
            type,
            timer: 5000,
            z_index: 2000,
            placement: {
                from: 'top',
                align: 'right',
            },
        });
    }
}
