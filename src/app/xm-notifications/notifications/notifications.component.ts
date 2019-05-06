import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotificationsService } from '../shared/notifications.service';
import { XmConfigService } from '../../shared';
import { Notification } from '../shared/notification.model';

import { DomSanitizer } from '@angular/platform-browser'

declare let $: any;

const DEFAULT_PRIVILEGES = ['XMENTITY.SEARCH', 'XMENTITY.SEARCH.QUERY', 'XMENTITY.SEARCH.TEMPLATE'];

@Component({
    selector: 'xm-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

    private entityListModifications: Subscription;
    private entityEntityStateChange: Subscription;

    config: any;
    isOpened: boolean;
    showCount: number;
    notificationsCount: string;
    notifications: Notification[];
    redirectUrl: string;
    autoUpdateEnabled: boolean = null;
    privileges: string[];

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
        private notificationsService: NotificationsService) {
        this.isOpened = false;
        this.notifications = [];
        this.notificationsCount = null;
        this.config = null;
    }

    ngOnInit () {
        this.entityListModifications = this.eventManager.subscribe('xmEntityListModification',
            () => this.load());
        this.entityEntityStateChange = this.eventManager.subscribe('xmEntityDetailModification',
            () => this.load());

        this.load();
    }

    ngOnDestroy () {
        this.eventManager.destroy(this.entityListModifications);
        this.eventManager.destroy(this.entityEntityStateChange);
    }

    public load() {
        this.xmConfigService.getUiConfig().subscribe(config => {
            this.config = config.notifications ? config.notifications : null;
            this.mapPrviliges(config.notifications);
            if (this.config) {
                this.getNotifications(this.config);
            }
            if (this.config && this.config.autoUpdate && !this.autoUpdateEnabled) {
                const self = this;
                self.autoUpdateEnabled = true;
                // @TODO should be redone with wesocets or somthing like that
                setInterval(function () {
                    self.getNotifications(self.config);
                }, self.config.autoUpdate)
            }
        });
    }

    public getNotifications(config) {
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
                this.updateCount(this.notifications);
                this.redirectUrl = config.redirectUrl;
                this.showCount = config.max ? parseFloat(config.max) - 1 : 5;
            });
    }

    public onRemoveItem(event, item): void {
        event.stopPropagation();
        if (this.config && this.config.changeStateName) {
            this.notificationsService.markRead(item.id, this.config.changeStateName).subscribe(resp => {
                this.notifications = this.notifications.filter(i => i !== item);
                this.updateCount(this.notifications);
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

    private updateCount(arr): void {
        this.notificationsCount = arr.length;
    }

    private onNavigate(item, event) {
        if (this.config.preventNavigation) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        if (item) {
            this.router.navigate(['/application', item.typeKey, item.id]);
            this.toggleNotifications();
        }
    }

    private mapPrviliges(config: any): void {
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
