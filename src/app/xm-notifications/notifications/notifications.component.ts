import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotificationsService } from '../shared/notifications.service';
import { Principal, XmConfigService } from '../../shared';
import { Notification, NotificationUiConfig } from '../shared/notification.model';

import { DomSanitizer } from '@angular/platform-browser'

declare let $: any;
import * as _ from 'lodash';

const DEFAULT_PRIVILEGES = ['XMENTITY.SEARCH', 'XMENTITY.SEARCH.QUERY', 'XMENTITY.SEARCH.TEMPLATE'];

@Component({
    selector: 'xm-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

    private entityListModifications: Subscription;
    private entityEntityStateChange: Subscription;

    config: NotificationUiConfig;
    isOpened: boolean;
    showCount: number;
    notifications: Notification[];
    redirectUrl: string;
    autoUpdateEnabled: boolean = null;
    privileges: string[];
    updateInterval: number;

    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (!(this.eRef.nativeElement.contains(event.target))) {
            this.isOpened = false;
        }
    }

    constructor(
        private xmConfigService: XmConfigService,
        private eventManager: JhiEventManager,
        private router: Router,
        private sanitized: DomSanitizer,
        private eRef: ElementRef,
        private principal: Principal,
        private notificationsService: NotificationsService) {
        this.isOpened = false;
        this.notifications = [];
        this.config = null;
    }

    ngOnInit () {
        this.entityListModifications = this.eventManager.subscribe('xmEntityListModification',
            () => this.load());
        this.entityEntityStateChange = this.eventManager.subscribe('xmEntityDetailModification',
            () => this.load());
        this.load(true);
    }

    ngOnDestroy () {
        this.eventManager.destroy(this.entityListModifications);
        this.eventManager.destroy(this.entityEntityStateChange);
    }

    get notificationsCount(): number {
        return this.notificationsService.totalCount;
    }
    public load(initAutoUpdate?: boolean) {
        this.xmConfigService.getUiConfig().subscribe(config => {
            this.config = <NotificationUiConfig>config.notifications;
            this.mapPrviliges(this.config);
            if (this.config) {
                this.getNotifications(this.config);
            }
            if (this.config && this.config.autoUpdate && !this.autoUpdateEnabled && initAutoUpdate) {
                const self = this;
                self.autoUpdateEnabled = true;
                // @TODO should be redone with webocets
                this.updateInterval = setInterval(function () {
                    if (self.principal.isAuthenticated()) {
                        self.getNotifications(self.config);
                    } else {
                        clearInterval(self.updateInterval);
                    }
                }, self.config.autoUpdate)
            }
        });
    }

    public getNotifications(config: NotificationUiConfig) {
        this.notificationsService.getNotifications(config).pipe(
            map((notifications: any) => {
                notifications.forEach(notification => {
                    if (config.showAsHtml) {
                        notification.label = this.sanitized.bypassSecurityTrustHtml(notification.label);
                    }
                });
                return notifications;
            }))
            .subscribe(resp => {
                this.notifications = resp;
                this.redirectUrl = config.redirectUrl;
                this.showCount = config.max ? config.max - 1 : 5;
            });
    }

    public onRemoveItem(event, item): void {
        event.stopPropagation();
        if (this.config && this.config.changeStateName) {
            this.notificationsService.markRead(item.id, this.config).subscribe(() => {
                this.notifications = this.notifications.filter(i => i !== item);
            });
        }
    }

    public toggleNotifications(): void {
        this.isOpened = !this.isOpened;
    }

    public viewAll(url) {
        this.router.navigate([url]);
        this.toggleNotifications();
    }

    public onNavigate(item, event): void {
        if (this.config.preventNavigation) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        if (item) {
            const typeKey = _.get(item, this.config.referenceTypeKeyPath);
            const id = _.get(item, this.config.referenceIdPath);
            if (!typeKey || !id) {
                console.log('No entity found for notification ' + item.id);
                return;
            }

            this.router.navigate(['/application', typeKey, id]);
            this.toggleNotifications();
        }
    }

    private mapPrviliges(config: NotificationUiConfig): void {
        this.privileges = [];
        if (config && config.privileges && config.privileges.length > 0) {
            config.privileges.map(p => {
                this.privileges.push(p);
            });
        } else {
            this.privileges = DEFAULT_PRIVILEGES;
        }
    }
}
