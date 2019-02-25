import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TimeAgoService {

    constructor(private translateService: TranslateService) {
    }

    transform(value: string) {
        const d = new Date(value);
        const now = new Date();
        const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
        const minutes = Math.round(Math.abs(seconds / 60));
        const hours = Math.round(Math.abs(minutes / 60));
        const days = Math.round(Math.abs(hours / 24));
        const months = Math.round(Math.abs(days / 30.416));
        const years = Math.round(Math.abs(days / 365));

        if (seconds <= 45) {
            // 'a few seconds ago';
            return this.translateService.instant('xm-timeline.common.time-ago.seconds');
        } else if (seconds <= 90) {
            // 'a minute ago';
            return this.translateService.instant('xm-timeline.common.time-ago.minute');
        } else if (minutes <= 45) {
            // ' minutes ago';
            return minutes + this.translateService.instant('xm-timeline.common.time-ago.minutes');
        } else if (minutes <= 90) {
            // 'an hour ago';
            return this.translateService.instant('xm-timeline.common.time-ago.hour');
        } else if (hours <= 22) {
            // ' hours ago';
            return hours + this.translateService.instant('xm-timeline.common.time-ago.hours');
        } else if (hours <= 36) {
            // 'a day ago';
            return this.translateService.instant('xm-timeline.common.time-ago.day');
        } else if (days <= 25) {
            // ' days ago';
            return days + this.translateService.instant('xm-timeline.common.time-ago.days');
        } else if (days <= 45) {
            // 'a month ago';
            return this.translateService.instant('xm-timeline.common.time-ago.month');
        } else if (days <= 345) {
            // ' months ago';
            return months + this.translateService.instant('xm-timeline.common.time-ago.months');
        } else if (days <= 545) {
            // 'a year ago';
            return this.translateService.instant('xm-timeline.common.time-ago.year');
        } else { // (days > 545)
            // ' years ago';
            return years + this.translateService.instant('xm-timeline.common.time-ago.years');
        }
    }

}
