import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { JhiHealthService } from './health.service';
import {UseGlobalTranslations} from "../../shared/language/use.global.location";
import {JhiLanguageService} from "ng-jhipster";

@Component({
    selector: 'xm-health-modal',
    templateUrl: './health-modal.component.html'
})
@UseGlobalTranslations()
export class JhiHealthModalComponent {

    currentHealth: any;

    constructor(private healthService: JhiHealthService,
                public activeModal: NgbActiveModal,
                private jhiLanguageService: JhiLanguageService) {
        this.jhiLanguageService.addLocation('health');
    }

    baseName(name) {
        return this.healthService.getBaseName(name);
    }

    subSystemName(name) {
        return this.healthService.getSubSystemName(name);
    }

    readableValue(value: number) {
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
