import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { TranslateService, TranslationChangeEvent, LangChangeEvent } from 'ng2-translate/ng2-translate';

import { LANGUAGES } from './language.constants';
import {Observable} from "rxjs/Observable";
import {EventManager, TranslatePartialLoader} from "ng-jhipster";
import {XmConfigService} from '../../admin/configuration/config.service';
import {CustomTranslatePartialLoader} from './language.loader';

@Injectable()
export class JhiLanguageHelper {

    constructor(
        private translateService: TranslateService,
        private titleService: Title,
        private router: Router,
        private xmConfigService: XmConfigService,
        private eventManager: EventManager,
        private customTranslatePartialLoader: CustomTranslatePartialLoader,
    ) {
        this.init();
        customTranslatePartialLoader.init();
    }

    getAll(): Promise<any> {
        return this.xmConfigService.getUiConfig().map(uiConfig => {
            if (uiConfig && uiConfig.langs) {
                return uiConfig.langs;
            } else {
                return LANGUAGES;
            }
        }).toPromise();
    }

    /**
     * Update the window title using params in the following
     * order:
     * 1. titleKey parameter
     * 2. $state.$current.data.pageTitle (current state page title)
     * 3. 'global.title'
     */
    updateTitle(titleKey?: string) {
        let trans = [],
            routeSnapshot: ActivatedRouteSnapshot = this.router.routerState.snapshot.root,
            title = this.getPageTitle(routeSnapshot, 'pageTitle', true),
            subTitle = this.getPageTitle(routeSnapshot, 'pageSubTitle'),
            subTitleTrans = this.getPageTitle(routeSnapshot, 'pageSubTitleTrans'),
            subSubTitle = this.getPageTitle(routeSnapshot, 'pageSubSubTitle')
        ;
        trans.push(this.translateService.get(title));

        if (subTitle || subTitleTrans) {
            trans.push(subTitleTrans ? this.translateService.get(subTitleTrans) : Promise.resolve(subTitle));
        }

        subSubTitle && trans.push(Observable.of(subSubTitle));

        Observable.forkJoin(trans)
            .subscribe((result: string[]) => {
                let title: string = result.join(" - ");
                if (!/translation-not-found/.test(title)) {
                    this.titleService.setTitle(title);
                    this.eventManager.broadcast({name: 'pageTitleModification', content: title});
                }
            })
        ;
    }

    private init() {
        this.translateService.onTranslationChange.subscribe((event: TranslationChangeEvent) => {
            this.updateTitle();
        });

        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.updateTitle();
        });
    }

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot, name: string, isMain?: boolean) {
        let title = routeSnapshot.data && routeSnapshot.data[name];
        return routeSnapshot.firstChild ?
            this.getPageTitle(routeSnapshot.firstChild, name, isMain) :
            (isMain ? title || 'global.title' : title);
    }
}

