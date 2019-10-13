import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'xm-per-page',
    templateUrl: './xm-per-page.component.html',
    styles: [`
        .form-group {
            display: inline-block;
            margin: 0;
            padding: 0;
        }
        .form-control {
            display: inline-block;
            width: auto;
        }
        .pager-wrapper {
            display: inline-block;
            width: 50px;
            padding-top: 6px;
        }
    `]
})
export class PerPageComponent {

    @Input() sizes: number[] = [10, 20, 50];
    @Input() itemsPerPage: number = 10;
    @Output() itemsPerPageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() onChange = new EventEmitter<number>();

    constructor(
    ) {
    }

    onChangeSelect() {
        this.itemsPerPageChange.emit(this.itemsPerPage);
        this.onChange.emit(this.itemsPerPage);
    }

}
