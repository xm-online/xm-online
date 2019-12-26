import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { JhiHealthService } from './health.service';

@Component({
    selector: 'xm-health-modal',
    templateUrl: './health-modal.component.html',
})
export class JhiHealthModalComponent implements OnInit {

    public currentHealth: any;
    public aceEditorOptions: any = {
        highlightActiveLine: false,
        maxLines: 1000,
        printMargin: false,
        showGutter: false,
        autoScrollEditorIntoView: true,
    };
    public editorValue: string;

    constructor(public activeModal: NgbActiveModal,
                private healthService: JhiHealthService) {
    }

    public ngOnInit(): void {
        this.editorValue = JSON.stringify(this.currentHealth, null, 4) || null;
    }

    public baseName(name: any): string {
        return this.healthService.getBaseName(name);
    }

    public subSystemName(name: any): string {
        return this.healthService.getSubSystemName(name);
    }

    public readableValue(value: number): string {
        if (this.currentHealth.name !== 'diskSpace') {
            return value.toString();
        }

        // Should display storage space in an human readable unit
        const val = value / 1073741824;
        if (val > 1) { // Value
            return val.toFixed(2) + ' GB';
        } else {
            return (value / 1048576).toFixed(2) + ' MB';
        }
    }
}
