import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { ProfileInfo } from './profile-info.model';
import {UseGlobalTranslations} from "../../shared/language/use.global.location";

@Component({
    selector: 'xm-page-ribbon',
    template: `<div class="ribbon" *ngIf="ribbonEnv"><a href="" jhiTranslate="global.ribbon.{{ribbonEnv}}">{{ribbonEnv}}</a></div>`,
    styleUrls: [
        'page-ribbon.css'
    ]
})
@UseGlobalTranslations()
export class PageRibbonComponent implements OnInit {

    profileInfo: ProfileInfo;
    ribbonEnv: string;

    constructor(private profileService: ProfileService) {}

    ngOnInit() {
        this.profileService.getProfileInfo().subscribe((profileInfo) => {
            this.profileInfo = profileInfo;
            this.ribbonEnv = profileInfo.ribbonEnv;
        });
    }
}
