import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'xm-metrics-modal',
    templateUrl: './metrics-modal.component.html',
})
export class JhiMetricsMonitoringModalComponent implements OnInit {

    public threadDumpFilter: any;
    public threadDump: any;
    public threadDumpAll: number = 0;
    public threadDumpBlocked: number = 0;
    public threadDumpRunnable: number = 0;
    public threadDumpTimedWaiting: number = 0;
    public threadDumpWaiting: number = 0;

    constructor(public activeModal: NgbActiveModal) {
        // TODO:
        //  this.jhiLanguageService.addLocation('metrics');
    }

    public ngOnInit(): void {
        this.threadDump.forEach((value) => {
            if (value.threadState === 'RUNNABLE') {
                this.threadDumpRunnable += 1;
            } else if (value.threadState === 'WAITING') {
                this.threadDumpWaiting += 1;
            } else if (value.threadState === 'TIMED_WAITING') {
                this.threadDumpTimedWaiting += 1;
            } else if (value.threadState === 'BLOCKED') {
                this.threadDumpBlocked += 1;
            }
        });

        this.threadDumpAll = this.threadDumpRunnable + this.threadDumpWaiting +
            this.threadDumpTimedWaiting + this.threadDumpBlocked;
    }

    public getBadgeClass(threadState: string): string {
        if (threadState === 'RUNNABLE') {
            return 'badge-success';
        } else if (threadState === 'WAITING') {
            return 'badge-info';
        } else if (threadState === 'TIMED_WAITING') {
            return 'badge-warning';
        } else if (threadState === 'BLOCKED') {
            return 'badge-danger';
        }
        return '';
    }
}
