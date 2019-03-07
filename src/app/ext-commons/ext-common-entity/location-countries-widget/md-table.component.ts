import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'xm-md-table',
    templateUrl: './md-table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdTableComponent {

    @Input() title: string;
    @Input() subtitle: string;
    @Input() cardClass: string;
    @Input() data: TableData;

    constructor() {
    }
}
