import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';

declare const $: any;

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
    @Output() public close: EventEmitter<any> = new EventEmitter();

    constructor(config: NgbAlertConfig) {
        this.dismissible = config.dismissible;
        this.type = config.type;
    }

    public ngOnInit(): void {
        if (this.message) {
            this.showAlert(this.type, this.message);
        }
    }

    public showAlert(type: any, message: any): void {
        $.notify({
            icon: 'add',
            message,
        }, {
            type,
            timer: 5000,
            // eslint-disable-next-line @typescript-eslint/camelcase
            z_index: 2000,
            placement: {
                from: 'top',
                align: 'right',
            },
        });
    }
}
