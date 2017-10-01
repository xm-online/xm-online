import { Component, OnInit } from '@angular/core';
import { JhiLanguageService  } from 'ng-jhipster';
import {EventService} from '../../entities/event/event.service';
import {Event} from '../../entities/event/event.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'xm-event-detail',
    templateUrl: './event-detail.component.html'
})
export class EventDetailComponent implements OnInit {

    event: Event;
    onDelete: (id: number) => {};

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventService: EventService,
        private activeModal: NgbActiveModal
    ) {
        this.jhiLanguageService.addLocation('event');
        this.jhiLanguageService.addLocation('xmEntity');
    }

    ngOnInit() {
    }

    load(id) {
        this.eventService.find(id).subscribe((event) => {
            this.event = event;
        });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    delete() {
        this.eventService.delete(this.event.id).subscribe((response) => {
            this.onDelete(this.event.id);
            this.activeModal.dismiss(true);
        });
    }


}
