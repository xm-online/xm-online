import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiDateUtils } from 'ng-jhipster';
import { finalize } from 'rxjs/operators';

import { Principal } from '../../shared/auth/principal.service';
import { CalendarSpec } from '../shared/calendar-spec.model';
import { Calendar } from '../shared/calendar.model';
import { CalendarService } from '../shared/calendar.service';
import { Event } from '../shared/event.model';
import { EventService } from '../shared/event.service';
import { XmEntity } from '../shared/xm-entity.model';

declare let swal: any;

@Component({
    selector: 'xm-calendar-event-dialog',
    templateUrl: './calendar-event-dialog.component.html',
    styleUrls: ['./calendar-event-dialog.component.scss']
})
export class CalendarEventDialogComponent implements OnInit {

    @Input() xmEntity: XmEntity;
    @Input() calendar: Calendar;
    @Input() calendarSpec: CalendarSpec;
    @Input() startDate: any;
    @Input() endDate: any;
    @Input() onAddEvent: (Event) => {};

    event: Event = new Event();
    showLoader: boolean;

    constructor(private activeModal: NgbActiveModal,
                private eventService: EventService,
                private calendarService: CalendarService,
                private dateUtils: JhiDateUtils,
                private translateService: TranslateService,
                public principal: Principal) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.event.startDate = this.startDate;
            this.event.endDate = this.endDate;
        });
    }

    onConfirmSave() {
        this.showLoader = true;
        if (this.calendar.id) {
            this.event.calendar = this.calendar;
            this.eventService.create(this.event).pipe(finalize(() => this.showLoader = false))
                .subscribe(
                (eventResp: HttpResponse<Event>) => this.onSaveSuccess(this.calendar.id, eventResp.body),
                (err) => console.log(err),
                () => this.showLoader = false);
        } else {
            const copy: Event = Object.assign({}, this.event);
            copy.startDate = this.dateUtils.toDate(this.event.startDate);
            copy.endDate = this.dateUtils.toDate(this.event.endDate);
            this.calendar.events = [copy];
            this.calendarService.create(this.calendar).pipe(finalize(() => this.showLoader = false))
                .subscribe(
                (calendarResp: HttpResponse<Calendar>) => this.onSaveSuccess(calendarResp.body.id, calendarResp.body.events.shift()),
                (err) => console.log(err),
                () => this.showLoader = false);
        }
    }

    private onSaveSuccess(calendarId: number, event: Event) {
        this.activeModal.dismiss(true);
        this.alert('success', 'xm-entity.calendar-event-dialog.add.success');
        this.calendar.id = calendarId;
        this.onAddEvent(event);
    }

    onCancel() {
        this.activeModal.dismiss('cancel');
    }

    private alert(type, key) {
        swal({
            type: type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary'
        });
    }

}
