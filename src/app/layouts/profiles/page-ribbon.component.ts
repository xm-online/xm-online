import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from './profile.service';
import { ProfileInfo } from './profile-info.model';
import {Principal} from '../../shared/auth/principal.service';
import {Subscription} from 'rxjs';
import {JhiEventManager} from 'ng-jhipster';
import {XM_EVENT_LIST} from '../../xm.constants';

@Component({
    selector: 'xm-page-ribbon',
    template: `<div class="ribbon" *ngIf="ribbonEnv"><a href="" jhiTranslate="global.ribbon.{{ribbonEnv}}">{{ribbonEnv}}</a></div>`,
    styleUrls: [
        'page-ribbon.css'
    ]
})
export class PageRibbonComponent implements OnInit, OnDestroy {

    profileInfo: ProfileInfo;
    ribbonEnv: string;
    private eventAuthSubscriber: Subscription;

    constructor(
        private principal: Principal,
        private profileService: ProfileService,
        private eventManager: JhiEventManager,
    ) {
        this.registerChangeAuth();
    }

    ngOnInit() {

      this.principal.hasAnyAuthority(['ROLE_ADMIN'])
        .then(value => {
          if (value) {
            this.principal.getAuthenticationState().subscribe(state => {
              if (state) {
                this.principal.identity()
                  .then(() => {
                    this.profileService.getProfileInfo().subscribe((profileInfo) => {
                      this.profileInfo = profileInfo;
                      this.ribbonEnv = profileInfo.ribbonEnv;
                    });
                  });
              }});
          }
        })
        .catch(error => console.log('PageRibbonComponent %o', error));

    }

    ngOnDestroy() {
      if (this.ribbonEnv) {
        this.eventManager.destroy(this.eventAuthSubscriber);
      }
    }

    private registerChangeAuth() {
      if (this.ribbonEnv) {
        this.eventAuthSubscriber = this.eventManager.subscribe(XM_EVENT_LIST.XM_SUCCESS_AUTH, () => this.ngOnInit());
      }
    }
}
