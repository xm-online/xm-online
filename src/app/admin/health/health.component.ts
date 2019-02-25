import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService } from 'ng-jhipster';

import { JhiHealthService } from './health.service';
import { JhiHealthModalComponent } from './health-modal.component';

@Component({
    selector: 'xm-health',
    templateUrl: './health.component.html',
    styleUrls: ['./health.component.scss']
})
export class JhiHealthCheckComponent implements OnInit {

    healthData: any;
    showLoader: boolean;
    allHealthChecks: any[];
    services: any[];
    instances: any[];
    selectedService = '';
    selectedInstance = '';
    selectedInstanceStatus: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private modalService: NgbModal,
        private healthService: JhiHealthService
    ) {
    }

    ngOnInit() {
        this.initHealthCheck();
    }

    initHealthCheck() {
        this.healthService
            .getMonitoringServicesCollection()
            .subscribe(result => {
                this.services = result || [];
                if (this.services.length > 0) {
                    this.selectedService = this.services[0].name;
                    this.onServiceSelect();
                }
            }, error => console.log(error));
    }

    onServiceSelect(): void {
        this.instances = null;
        this.services
            .filter(s => s.name === this.selectedService)
            .map(i => this.instances = i.instances || null);
        this.getHealthCheck(this.selectedService);
    }

    getHealthCheck(selectedService: string): void {
        this.showLoader = true;
        this.healthData = [];
        this.selectedInstanceStatus = null;
        this.healthService
            .getHealsCheckByMsName(selectedService, 'health')
            .subscribe(result => {
                this.allHealthChecks = result || [];
                this.mapHealthCheck(this.allHealthChecks[0].instanceId);
                this.showLoader = false;
            }, error => {
                console.log(error);
                if (error.status === 503) {
                    this.healthData = this.healthService.transformHealthData(error.json());
                }
                this.showLoader = false;
            });
    }

    mapHealthCheck(metricId) {
        this.selectedInstance = metricId || '';
        const currentMetrics = this.allHealthChecks.filter(h => h.instanceId === metricId).shift();
        this.healthData = currentMetrics && currentMetrics.health
            ? this.healthService.transformHealthData(currentMetrics.health)
            : [];
        this.selectedInstanceStatus =
            currentMetrics
            && currentMetrics.health
            && currentMetrics.health.status
            ? currentMetrics.health.status : null;
    }

    baseName(name: string) {
        return this.healthService.getBaseName(name);
    }

    getBadgeClass(statusState) {
        if (statusState === 'UP') {
            return 'badge-success';
        } else {
            return 'badge-danger';
        }
    }

    showHealth(health: any) {
        const modalRef  = this.modalService.open(JhiHealthModalComponent, {backdrop: 'static'});
        modalRef.componentInstance.currentHealth = health;
        modalRef.result.then((result) => {
            // Left blank intentionally, nothing to do here
        }, (reason) => {
            // Left blank intentionally, nothing to do here
        });
    }

    subSystemName(name: string) {
        return this.healthService.getSubSystemName(name);
    }

}
