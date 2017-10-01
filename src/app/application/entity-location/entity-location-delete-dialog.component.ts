import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Location } from '../../entities/location/location.model';
import { LocationService } from '../../entities/location/location.service';

@Component({
    selector: 'xm-location-delete-dialog',
    templateUrl: './entity-location-delete-dialog.component.html'
})
export class EntityLocationDeleteDialogComponent {

    location: Location;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private locationService: LocationService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.addLocation('location');
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.locationService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'locationListModification',
                content: 'Deleted an location'
            });
            this.activeModal.dismiss(true);
        });
    }
}
