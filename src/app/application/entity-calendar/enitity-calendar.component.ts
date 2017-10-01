import {Component, Input, AfterViewInit} from '@angular/core';
import {XmEntitySpecService} from '../../shared/spec/spec.service';
import {JhiLanguageService, DateUtils} from 'ng-jhipster';
import {XmEntityService} from '../../entities/xm-entity/xm-entity.service';
import {XmEntity} from '../../entities/xm-entity/xm-entity.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NewCalendarEventDialog} from './enitity-calendar-event-dialog.component';
import {Calendar} from '../../entities/calendar/calendar.model';
import {Event} from '../../entities/event/event.model';
import {EventDetailComponent} from './event-detail.component';

declare let $: any;

@Component({
    selector: 'xm-calendar-cmp',
    templateUrl: 'enitity-calendar.component.html'
})
export class CalendarComponent implements AfterViewInit {

    @Input() xmEntityId: number;

    private xmEntity: XmEntity;
    private selectedCalendar: Calendar;
    private readonly CALENDAR_ID = 'CalendarId';
    private calendarElements = {};
    private calendarTypes;

    private calendars = [];


    private lang: string;

    constructor(private jhiLanguageService: JhiLanguageService,
                private xmEntitySpecService: XmEntitySpecService,
                private xmEntityService: XmEntityService,
                private modalService: NgbModal,
                private dateUtils: DateUtils,
    ) {
        this.jhiLanguageService.addLocation('xmEntity');
        this.lang = this.jhiLanguageService.currentLang;
    }

    ngAfterViewInit() {
        this.xmEntityService.find(this.xmEntityId, ['calendars.events']).subscribe((xmEntity: XmEntity) => {
            this.xmEntity = xmEntity;
            this.calendars = xmEntity.calendars;
            this.calendarTypes = this.xmEntitySpecService.getCalendars(xmEntity.typeKey);
            let calendarTypes = this.calendarTypes;
            if (!calendarTypes) {
                return;
            }

            Object.keys(calendarTypes).map(calendarTypeKey => {
                let calendarType = calendarTypes[calendarTypeKey];
                if (calendarType.events) {
                    calendarType.events.map(event => event.title = this.getName(event, this.lang));
                }
            });

            // select types for not exists calendars
            let calendarTypeKeys = this.getTypesWithNoInstansOfCalendar(calendarTypes);
            this.createNewCalendarsForNewTypes(calendarTypeKeys, calendarTypes);

            this.selectedCalendar = this.calendars[0];
            for (let calendar of this.calendars) {
                this.doAfterModelApply(() => this.initCalendar(calendar));
            }

            this.doAfterModelApply(() => $('.selectpicker').selectpicker());
        });
    }

    private createNewCalendarsForNewTypes(calendarTypeKeys: string[], calendarTypes: {}) {
        calendarTypeKeys.forEach(typeKey => {
            const calendar = new Calendar();
            calendar.name = this.getName(this.calendarTypes[typeKey], this.lang);

            calendar.typeKey = typeKey;
            calendar.startDate = new Date().toISOString();
            calendar.events = [];

            this.calendars.push(calendar);
        });
    }

    getName(type, lang: string) {
        const name = type.name;
        if (name && name[lang]) {
            return type.name[lang];
        } else if (name && name.en) {
            return  type.name.en;
        } else {
            return type.key;
        }
    }

    private getTypesWithNoInstansOfCalendar(calendarTypes: {}) {
        let cTypes = [];
        if (this.calendars) {
            cTypes = this.calendars.map(calendar => calendar.typeKey);
        } else {
            this.calendars = [];
        }
        let calendarTypeKeys = Object.keys(calendarTypes).filter(typeKey => cTypes.indexOf(typeKey) < 0);
        return calendarTypeKeys;
    }

    private getIdentity(calendar) {
        if (!calendar) {
            return 'null';
        }
        return calendar.id;
    }

    onCalendarChange(calendar: Calendar) {
        this.selectedCalendar = calendar;
        this.doAfterModelApply(() => $(this.calendarElements[this.getIdentity(calendar)]).data('fullCalendar').render());
    }

    private openDialog(dialogClass, operation, options?) {
        const modalRef = this.modalService.open(dialogClass, options ? options : {});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        operation(modalRef);
        return modalRef;
    }

    private initCalendar(calendar: Calendar) {

        let calendarIdentity = this.getIdentity(calendar);
        let self = this;
        let $calendar = $('#' + calendarIdentity + this.CALENDAR_ID);
        this.calendarElements[calendarIdentity] = $calendar;

        let today = new Date();
        let y = today.getFullYear();
        let m = today.getMonth();
        let d = today.getDate();

        let events = [];
        if (calendar.events) {
            events = calendar.events.map(e => self.mapEvent(this.calendarTypes[calendar.typeKey], e));
        }

        $calendar.fullCalendar({
            viewRender: function (view, element) {
                if (view.name != 'month') {
                    let $fc_scroller = $('.fc-scroller');
                    $fc_scroller.perfectScrollbar();
                }
            },
            header: {
                left: 'title',
                center: 'month,agendaWeek,agendaDay,listDay,listWeek',
                right: 'prev,next,today'
            },
            defaultDate: today,
            selectable: true,
            selectHelper: true,
            views: {
                month: { // name of view
                    titleFormat: 'MMMM YYYY'
                },
                week: {
                    titleFormat: 'MMMM D YYYY',
                    timeFormat: 'H(:mm)'
                },
                day: {
                    titleFormat: 'D MMM, YYYY',
                    timeFormat: 'H(:mm)'
                },
                listDay: {
                    buttonText: 'list day',
                    timeFormat: 'H(:mm)'
                },
                listWeek: {
                    buttonText: 'list week',
                    timeFormat: 'H(:mm)'
                }
            },

            select: function (start, end) {

                self.openDialog(NewCalendarEventDialog, modalRef => {
                    modalRef.componentInstance.calendar = self.selectedCalendar;
                    modalRef.componentInstance.startDate = start.format('YYYY-MM-DD') + 'T' + start.format('HH:mm:ss');
                    modalRef.componentInstance.endDate = end.format('YYYY-MM-DD') + 'T' + end.format('HH:mm:ss');
                    let calendarType = self.calendarTypes[self.selectedCalendar.typeKey];
                    modalRef.componentInstance.calendarType = calendarType;

                    let selectedCalendar = self.selectedCalendar;

                    modalRef.componentInstance.onAddEvent = (event: Event) => {

                        selectedCalendar.events.push(event);

                        let eventData = self.mapEvent(calendarType, event);

                        $calendar.fullCalendar('renderEvent', eventData, true); // stick? = true
                        $calendar.fullCalendar('unselect');
                    };

                });

            },
            editable: false,
            eventLimit: true, // allow "more" link when too many events
            events: events,
            timeFormat: 'H(:mm)',
            eventRender: function(event, element) {
                let content = $(element).find('.fc-content');
                if ($(element).find('.fc-title').is('div')) {
                    let description = $('<div></div>');
                    $(description).addClass('fc-title');
                    $(description).text(event.description);
                    content.append(description);
                }
            },
            eventClick: function(event, element) {

                self.openDialog(EventDetailComponent, modalRef => {
                    modalRef.componentInstance.event = event.originEvent;
                    modalRef.componentInstance.onDelete = (id) => {
                        $calendar.fullCalendar('removeEvents', [id]);
                    };
                });

            }
        });

    }

    private mapEvent(calendarType: any, event: Event) {
        let eventType = calendarType.events.filter(e => e.key === event.typeKey)[0];
        let title = event.title;
        title += '\n (' + this.getName(eventType, this.lang) + ')';

        let eventData = {
            id: event.id,
            title: title,
            start: this.dateUtils.convertDateTimeFromServer(event.startDate),
            end: this.dateUtils.convertDateTimeFromServer(event.endDate),
            description: event.description,
            color: eventType.color,
            originEvent: event
        };
        return eventData;
    }

    private doAfterModelApply(task) {
        setTimeout(task, 0);
    }

}
