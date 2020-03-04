import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { XmAlertService } from '@xm-ngx/alert';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiDateUtils } from 'ng-jhipster';

import { Principal } from '../../shared/auth/principal.service';
import { I18nNamePipe } from '../../shared/language/i18n-name.pipe';
import { DEBUG_INFO_ENABLED } from '../../xm.constants';
import { CalendarEventDialogComponent } from '../calendar-event-dialog/calendar-event-dialog.component';
import { CalendarSpec } from '../shared/calendar-spec.model';
import { Calendar } from '../shared/calendar.model';
import { Event } from '../shared/event.model';
import { EventService } from '../shared/event.service';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';

declare const $: any;

@Component({
    selector: 'xm-calendar-card',
    templateUrl: './calendar-card.component.html',
    styleUrls: ['./calendar-card.component.scss'],
})
export class CalendarCardComponent implements OnChanges {

    @Input() public xmEntityId: number;
    @Input() public calendarSpecs: CalendarSpec[];

    public xmEntity: XmEntity;
    public currentCalendar: Calendar;
    public calendars: Calendar[] = [];
    public calendarElements: any = {};

    constructor(private xmEntityService: XmEntityService,
                private eventService: EventService,
                private dateUtils: JhiDateUtils,
                private i18nNamePipe: I18nNamePipe,
                private toasterService: XmToasterService,
                private alertService: XmAlertService,
                private modalService: MatDialog,
                private principal: Principal) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.xmEntityId && changes.xmEntityId.previousValue !== changes.xmEntityId.currentValue) {
            this.load();
        }
    }

    public onRemove(event: Event, calendarTypeKey: string): void {
        this.alertService.open({
            title: 'xm-entity.calendar-card.delete.title',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'xm-entity.calendar-card.delete.button',
        }).subscribe((result) => {
            if (result.value) {
                this.eventService.delete(event.id).subscribe(
                    () => {
                        this.toasterService.success('xm-entity.calendar-card.delete.remove-success');
                        this.calendarElements[calendarTypeKey].fullCalendar('removeEvents', [event.id]);
                    },
                    () => this.toasterService.error('xm-entity.calendar-card.delete.remove-error'),
                );
            }
        });
    }

    public onCalendarChange(calendar: Calendar): void {
        this.currentCalendar = calendar;
        setTimeout(() => $(this.calendarElements[calendar.typeKey]).data('fullCalendar').render(), 50);
    }

    private load(): void {

        if (!this.calendarSpecs || !this.calendarSpecs.length) {
            if (DEBUG_INFO_ENABLED) {
                console.info('DBG: no spec no call');
            }
            return;
        }

        this.xmEntityService.find(this.xmEntityId, {embed: 'calendars.events'})
            .subscribe((xmEntity: HttpResponse<XmEntity>) => {
                this.xmEntity = xmEntity.body;
                if (xmEntity.body.calendars) {
                    this.calendars = [...xmEntity.body.calendars];
                }

                const notIncludedSpecs = this.calendarSpecs.filter((cs) => this.calendars
                    .filter((c) => c.typeKey === cs.key).length === 0);
                notIncludedSpecs.forEach((calendarSpec) => {
                    const calendar: Calendar = {};
                    calendar.name = this.i18nNamePipe.transform(calendarSpec.name, this.principal);
                    calendar.typeKey = calendarSpec.key;
                    calendar.startDate = new Date().toISOString();
                    calendar.xmEntity = {};
                    calendar.xmEntity.id = this.xmEntity.id;
                    calendar.xmEntity.typeKey = this.xmEntity.typeKey;
                    calendar.events = [];
                    this.calendars.push(calendar);
                });

                this.currentCalendar = this.calendars[0];
                for (const calendar of this.calendars) {
                    setTimeout(() => this.initCalendar(calendar), 50);
                }
            });
    }

    private initCalendar(calendar: Calendar): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const calendarSpec = this.calendarSpecs.filter((c) => c.key === calendar.typeKey).shift();
        this.calendarElements[calendar.typeKey] = $('#xm-calendar-' + calendar.id);
        this.calendarElements[calendar.typeKey].fullCalendar({
            header: {
                left: 'title',
                center: 'month,agendaWeek,agendaDay,listDay,listWeek',
                right: 'prev,next,today',
            },
            defaultDate: new Date(),
            selectable: true,
            selectHelper: true,
            views: {
                month: {
                    titleFormat: 'MMMM YYYY',
                },
                week: {
                    titleFormat: 'MMMM D YYYY',
                    timeFormat: 'H(:mm)',
                },
                day: {
                    titleFormat: 'D MMM, YYYY',
                    timeFormat: 'H(:mm)',
                },
                listDay: {
                    buttonText: 'list day',
                    timeFormat: 'H(:mm)',
                },
                listWeek: {
                    buttonText: 'list week',
                    timeFormat: 'H(:mm)',
                },
            },
            select: (start: any, end: any) => {
                const modalRef = self.modalService.open(CalendarEventDialogComponent, {width: '500px'});
                modalRef.componentInstance.xmEntity = self.xmEntity;
                modalRef.componentInstance.calendar = self.currentCalendar;
                modalRef.componentInstance.startDate = start.format('YYYY-MM-DD') + 'T' + start.format('HH:mm:ss');
                modalRef.componentInstance.endDate = end.format('YYYY-MM-DD') + 'T' + end.format('HH:mm:ss');
                modalRef.componentInstance.calendarSpec = calendarSpec;
                modalRef.componentInstance.onAddEvent = (event: Event) => {
                    self.currentCalendar.events = self.currentCalendar.events ? self.currentCalendar.events : [];
                    self.currentCalendar.events.push(event);
                    self.calendarElements[calendar.typeKey].fullCalendar('renderEvent',
                        self.mapEvent(calendarSpec, event), true);
                    self.calendarElements[calendar.typeKey].fullCalendar('unselect');
                };
            },
            editable: false,
            eventLimit: true,
            events: calendar.events ? calendar.events.map((e) => this.mapEvent(calendarSpec, e)) : [],
            timeFormat: 'H(:mm)',
            renderEvent: (event: any, element: any) => {
                const content = $(element).find('.fc-content');
                if ($(element).find('.fc-title').is('div')) {
                    const description = $('<div></div>');
                    $(description).addClass('fc-title');
                    $(description).text(event.description);
                    content.append(description);
                }
            },
            eventClick: (event: any) => {
                self.onRemove(event.originEvent, calendar.typeKey);
            },
        });
    }

    private mapEvent(calendarSpec: CalendarSpec, event: Event): any {
        const eventSpec = calendarSpec.events.filter((e) => e.key === event.typeKey).shift();
        return {
            id: event.id,
            title: event.title + '\n (' + this.i18nNamePipe.transform(eventSpec.name, this.principal) + ')',
            start: this.dateUtils.convertDateTimeFromServer(event.startDate),
            end: this.dateUtils.convertDateTimeFromServer(event.endDate),
            description: event.description,
            color: eventSpec.color,
            originEvent: event,
        };
    }

}
