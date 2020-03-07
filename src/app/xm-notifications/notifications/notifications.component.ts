import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { XmEventManager } from '@xm-ngx/core';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Principal } from '@xm-ngx/core/auth';
import { XmConfigService } from '../../shared/spec/config.service';
import { Notification, NotificationUiConfig } from '../shared/notification.model';

import { NotificationsService } from '../shared/notifications.service';

const DEFAULT_PRIVILEGES = ['XMENTITY.SEARCH', 'XMENTITY.SEARCH.QUERY', 'XMENTITY.SEARCH.TEMPLATE'];

@Component({
    selector: 'xm-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, OnDestroy {

    public config: NotificationUiConfig;
    public isOpened: boolean;
    public showCount: number;
    public notifications: Notification[];
    public redirectUrl: string;
    public autoUpdateEnabled: boolean = null;
    public privileges: string[];
    public updateInterval: number;
    private entityListModifications: Subscription;
    private entityEntityStateChange: Subscription;

    constructor(
        private xmConfigService: XmConfigService,
        private eventManager: XmEventManager,
        private router: Router,
        private sanitized: DomSanitizer,
        private eRef: ElementRef,
        private principal: Principal,
        private notificationsService: NotificationsService) {
        this.isOpened = false;
        this.notifications = [];
        this.config = null;
    }

    public get notificationsCount(): number {
        return this.notificationsService.totalCount;
    }

    @HostListener('document:click', ['$event'])
    public clickout(event: any): void {
        if (!(this.eRef.nativeElement.contains(event.target))) {
            this.isOpened = false;
        }
    }

    public ngOnInit(): void {
        this.entityListModifications = this.eventManager.subscribe('xmEntityListModification',
            () => this.load());
        this.entityEntityStateChange = this.eventManager.subscribe('xmEntityDetailModification',
            () => this.load());
        this.load(true);
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.entityListModifications);
        this.eventManager.destroy(this.entityEntityStateChange);
        clearInterval(this.updateInterval);
    }

    public load(initAutoUpdate: boolean = false): void {
        this.xmConfigService.getUiConfig().subscribe((config) => {
            this.config = config.notifications as NotificationUiConfig;
            this.mapPrviliges(this.config);
            if (this.config) {
                this.getNotifications(this.config);
            }
            if (this.config && this.config.autoUpdate && !this.autoUpdateEnabled && initAutoUpdate) {
                this.autoUpdateEnabled = true;
                // @TODO should be redone with webocets
                this.updateInterval = setInterval(() => {
                    if (this.principal.isAuthenticated()) {
                        this.getNotifications(this.config);
                    } else {
                        clearInterval(this.updateInterval);
                    }
                }, this.config.autoUpdate);
            }
        });
    }

    public getNotifications(config: NotificationUiConfig): void {
        this.notificationsService.getNotifications(config).pipe(
            map((notifications: any) => {
                notifications.forEach((notification) => {
                    if (config.showAsHtml) {
                        notification.label = this.sanitized.bypassSecurityTrustHtml(notification.label);
                    }
                });
                return notifications;
            }))
            .subscribe((resp) => {
                this.notifications = resp;
                this.redirectUrl = config.redirectUrl;
                this.showCount = config.max ? config.max - 1 : 5;
            });
    }

    public onRemoveItem(event: any, item: any): void {
        event.stopPropagation();
        if (this.config && this.config.changeStateName) {
            this.notificationsService.markRead(item.id, this.config).subscribe(() => {
                this.notifications = this.notifications.filter((i) => i !== item);
            });
        }
    }

    public toggleNotifications(): void {
        this.isOpened = !this.isOpened;
    }

    public viewAll(url: any): void {
        this.router.navigate([url]);
        this.toggleNotifications();
    }

    public onNavigate(item: any, event: any): void {
        if (this.config.preventNavigation) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        if (item) {
            const typeKey = _.get(item, this.config.referenceTypeKeyPath);
            const id = _.get(item, this.config.referenceIdPath);
            if (!typeKey || !id) {
                console.warn('No entity found for notification ' + item.id);
                return;
            }

            this.router.navigate(['/application', typeKey, id]);
            this.toggleNotifications();
        }
    }

    private mapPrviliges(config: NotificationUiConfig): void {
        this.privileges = [];
        if (config && config.privileges && config.privileges.length > 0) {
            config.privileges.forEach((p) => this.privileges.push(p));
        } else {
            this.privileges = DEFAULT_PRIVILEGES;
        }
    }
}
