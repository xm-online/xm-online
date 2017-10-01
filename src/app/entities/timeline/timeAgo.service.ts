import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import {JhiLanguageService} from 'ng-jhipster';
@Injectable()
export class TimeAgoService {

    constructor(private translateService: TranslateService,
                private jhiLanguageService: JhiLanguageService) {
        this.jhiLanguageService.addLocation('xmEntity');

    }

    transform(value:string) {
        let d = new Date(value);
        let now = new Date();
        let seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
        let minutes = Math.round(Math.abs(seconds / 60));
        let hours = Math.round(Math.abs(minutes / 60));
        let days = Math.round(Math.abs(hours / 24));
        let months = Math.round(Math.abs(days / 30.416));
        let years = Math.round(Math.abs(days / 365));
        
        if (seconds <= 45) {
            return this.translateService.instant("xm.xmEntity.timelines.timeAgo.seconds");//'a few seconds ago';
        } else if (seconds <= 90) {
            return this.translateService.instant("xm.xmEntity.timelines.timeAgo.minute");//'a minute ago';
        } else if (minutes <= 45) {
            return minutes + this.translateService.instant("xm.xmEntity.timelines.timeAgo.minutes");//' minutes ago';
        } else if (minutes <= 90) {
            return this.translateService.instant("xm.xmEntity.timelines.timeAgo.hour");//'an hour ago';
        } else if (hours <= 22) {
            return hours + this.translateService.instant("xm.xmEntity.timelines.timeAgo.hours");//' hours ago';
        } else if (hours <= 36) {
            return this.translateService.instant("xm.xmEntity.timelines.timeAgo.day");//'a day ago';
        } else if (days <= 25) {
            return days + this.translateService.instant("xm.xmEntity.timelines.timeAgo.days");//' days ago';
        } else if (days <= 45) {
            return this.translateService.instant("xm.xmEntity.timelines.timeAgo.month");//'a month ago';
        } else if (days <= 345) {
            return months + this.translateService.instant("xm.xmEntity.timelines.timeAgo.months");//' months ago';
        } else if (days <= 545) {
            return this.translateService.instant("xm.xmEntity.timelines.timeAgo.year");//'a year ago';
        } else { // (days > 545)
            return years + this.translateService.instant("xm.xmEntity.timelines.timeAgo.years");//' years ago';
        }
    }

}
