import {Component, OnInit, AfterViewInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertService, DateUtils, JhiLanguageService} from 'ng-jhipster';
import {XmEntity} from '../../entities/xm-entity';
import {FormGroup, NgForm} from '@angular/forms';
import {Event} from '../../entities/event/event.model';
import {EventService} from '../../entities/event/event.service';
import {Calendar} from '../../entities/calendar/calendar.model';
import {Response} from '@angular/http';
import {CalendarService} from '../../entities/calendar/calendar.service';
import {XmEntityService} from '../../entities/xm-entity/xm-entity.service';

declare var $: any;

@Component({
    selector: 'event-add-dialog',
    templateUrl: './enitity-calendar-event-dialog.component.html',
    styles: [`
        span.underline {
            border-bottom: solid;
        }
`]
})
export class NewCalendarEventDialog implements OnInit, AfterViewInit {


    authorities: any[];
    isSaving: boolean;

    xmEntity: XmEntity;
    calendar: Calendar;
    startDate: any;
    endDate: any;

    calendarType: any;

    onAddEvent: (Event) => {};

    private event: Event;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private activeModal: NgbActiveModal,
        private alertService: AlertService,
        private dateUtils: DateUtils,
        private eventService: EventService,
        private calendarService: CalendarService,
        private xmEntityService: XmEntityService
    ) {
        this.jhiLanguageService.addLocation('calendar');
        this.jhiLanguageService.addLocation('xmEntity');
        this.calendarType = new Object();
        this.calendarType.events = [];
        this.event = new Event();
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.event.startDate = this.startDate;
        this.event.endDate = this.endDate;
    }

    ngAfterViewInit() {
        //  Init Bootstrap Select Picker
        setTimeout(function() {
            if ($('.selectpicker').length !== 0) {
                $('.selectpicker').selectpicker();
            }
        }, 10);
    }


    clear() {
        this.activeModal.dismiss('cancel');
    }

    private validateForm(form: FormGroup): boolean {
        if (form.valid) {
            return true;
        }

        for (let controlName in form.controls) {
            let control = form.controls[controlName];
            if (control.valid) {
                continue;
            }
            control.updateValueAndValidity();
            control.markAsTouched(true);
            control.markAsDirty(true);

        }
        form.updateValueAndValidity();
        form.markAsTouched();
        form.markAsDirty();
        return false;
    }

    save(editForm: NgForm) {

        if (!this.validateForm(editForm.control)) {
            return;
        }

        this.isSaving = true;

        const event: Event = Object.assign({}, this.event);


        let calendar = Object.assign({}, this.calendar);
        calendar.id = this.calendar.id;
        calendar.events = null;
        calendar.xmEntity = new XmEntity();
        calendar.xmEntity.id = this.xmEntity.id;
        calendar.xmEntity.typeKey = this.xmEntity.typeKey;

        if (calendar.id) {
            event.assigned = this.xmEntity.id;

            event.calendar = calendar;

            this.eventService.create(event).subscribe((res: XmEntity) =>
                this.onSaveEventSuccess(res), (res: Response) => this.onSaveError(res));
        } else {
            event.startDate = this.dateUtils.toDate(event.startDate);
            event.endDate = this.dateUtils.toDate(event.endDate);

            event.assigned = this.xmEntity.id;

            calendar.events = [event];
            this.calendarService.create(calendar).subscribe((res: XmEntity) =>
                this.onSaveCalendarSuccess(res), (res: Response) => this.onSaveError(res));
        }

    }

    private onSaveCalendarSuccess(result) {
        this.onSaveSuccess(result);
        this.calendar.id = result.id;
        this.onAddEvent(result.events[0]);
    }


    private onSaveEventSuccess(result) {
        this.onSaveSuccess(result);
        this.onAddEvent(result);
    }

    private onSaveSuccess(result: any) {
        this.isSaving = false;
        this.activeModal.dismiss(result);
        console.log(result);
    }

    private onSaveError(error) {
        this.isSaving = false;
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }


}
