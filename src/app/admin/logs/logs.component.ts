import { Component, OnInit } from '@angular/core';
import { JhiOrderByPipe } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { finalize, map, share } from 'rxjs/operators';

import { JhiHealthService } from '../health/health.service';
import { Log } from './log.model';
import { LogsService } from './logs.service';

@Component({
    providers: [JhiOrderByPipe],
    selector: 'xm-logs',
    styleUrls: ['./logs.component.scss'],
    templateUrl: './logs.component.html',
})
export class LogsComponent implements OnInit {

    public loggers$: Observable<Log[]>;
    public filter: string;
    public orderProp: string;
    public showLoader: boolean;
    public reverse: boolean;
    public selectedService: string = '';
    public services: any[];

    constructor(
        private logsService: LogsService,
        private healthService: JhiHealthService,
        private orderBy: JhiOrderByPipe,
    ) {
        this.filter = '';
        this.orderProp = 'name';
        this.reverse = false;
        this.showLoader = true;
    }

    public ngOnInit(): void {
        this.healthService
            .getMonitoringServicesCollection()
            .subscribe((result) => {
                this.services = result || [];
                if (this.services.length > 0) {
                    this.selectedService = this.services[1].name;
                    this.getLoggers();
                }
            }, (error) => console.info(error));
    }

    public getLoggers(): void {
        this.showLoader = true;
        this.loggers$ = this.logsService
            .findByService(this.selectedService)
            .pipe(
                share(),
                map((resp) => resp.body),
                map((body) => this.orderBy.transform(body, this.orderProp, this.reverse)),
                finalize(() => this.showLoader = false),
                share(),
            );
    }

    public changeLevel(name: string, level: string): void {
        this.showLoader = true;
        const log = new Log(name, level);
        this.logsService
            .changeLevel(log, this.selectedService)
            .subscribe(() => this.getLoggers());
    }
}
