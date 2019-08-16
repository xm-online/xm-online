import { Component, OnInit } from '@angular/core';
import { finalize, map, share } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JhiOrderByPipe } from 'ng-jhipster';

import { Log } from './log.model';
import { LogsService } from './logs.service';
import { JhiHealthService } from '../health/health.service';

@Component({
    selector: 'xm-logs',
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.scss'],
    providers: [ JhiOrderByPipe ]
})
export class LogsComponent implements OnInit {

    loggers$: Observable<Log[]>;
    filter: string;
    orderProp: string;
    showLoader: boolean;
    reverse: boolean;
    selectedService = '';
    services: any[];

    constructor(
        private logsService: LogsService,
        private healthService: JhiHealthService,
        private orderBy: JhiOrderByPipe
    ) {
        this.filter = '';
        this.orderProp = 'name';
        this.reverse = false;
        this.showLoader = true;
    }

    ngOnInit() {
        this.healthService
            .getMonitoringServicesCollection()
            .subscribe(result => {
                this.services = result || [];
                if (this.services.length > 0) {
                    this.selectedService = this.services[1].name;
                    this.getLoggers();
                }
            }, error => console.log(error));
    }

    getLoggers() {
        this.showLoader = true;
        this.loggers$ = this.logsService
            .findByService(this.selectedService)
            .pipe(
                share(),
                map(resp => resp.body),
                map( body => this.orderBy.transform(body, this.orderProp, this.reverse)),
                finalize(() => this.showLoader = false ),
                share()
            )
    }

    changeLevel(name: string, level: string): void {
        this.showLoader = true;
        const log = new Log(name, level);
        this.logsService
            .changeLevel(log, this.selectedService)
            .subscribe(() => this.getLoggers());
    }
}
