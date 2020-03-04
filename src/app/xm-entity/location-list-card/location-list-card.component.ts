import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiEventManager } from 'ng-jhipster';

import { Subscription } from 'rxjs';
import { LocationDetailDialogComponent } from '../location-detail-dialog/location-detail-dialog.component';
import { LocationSpec } from '../shared/location-spec.model';
import { Location } from '../shared/location.model';
import { LocationService } from '../shared/location.service';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';

declare let $: any;
declare let google: any;

@Component({
    selector: 'xm-location-list-card',
    templateUrl: './location-list-card.component.html',
    styleUrls: ['./location-list-card.component.scss'],
})
export class LocationListCardComponent implements OnInit, OnChanges, OnDestroy {

    private static loadMap(location: Location): any {
        if (location.latitude && location.longitude) {
            const latLng = new google.maps.LatLng(location.latitude, location.longitude);
            const mapOptions = {
                zoom: 8,
                center: latLng,
                scrollwheel: false,
            };

            const map = new google.maps.Map(document.getElementById('location-map-' + location.id), mapOptions);
            const marker = new google.maps.Marker({
                position: latLng,
                title: location.name,
            });
            marker.setMap(map);
            return map;
        }
    }

    @Input() public xmEntityId: number;
    @Input() public locationSpecs: LocationSpec[];
    @Input() public entityUiConfig: any;
    public xmEntity: XmEntity;
    public locations: Location[];
    public locationMaps: any;
    public noDataText: any;
    private modificationSubscription: Subscription;

    constructor(private xmEntityService: XmEntityService,
                private locationService: LocationService,
                private modalService: MatDialog,
                private eventManager: JhiEventManager,
                private alertService: XmAlertService,
                private toasterService: XmToasterService,
                private translateService: TranslateService) {
    }

    public ngOnInit(): void {
        this.registerListModify();
        if (this.entityUiConfig && this.entityUiConfig.locations && this.entityUiConfig.locations.noData) {
            this.noDataText = this.entityUiConfig.locations.noData;
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.xmEntityId && changes.xmEntityId.previousValue !== changes.xmEntityId.currentValue) {
            this.load();
        }
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.modificationSubscription);
    }

    public getLocationSpec(location: Location): LocationSpec {
        return this.locationSpecs.filter((ls) => ls.key === location.typeKey).shift();
    }

    public getPrintAddress(location: Location): string {
        const country = location.countryKey
            ? this.translateService.instant('xm-entity.location-detail-dialog.countries.' + location.countryKey)
            : null;
        return $.grep(
            [
                country, location.region, location.city, location.addressLine1, location.addressLine2, location.zip,
            ],
            Boolean).join(', ');
    }

    public onCollapseMap(location: Location): void {
        if (this.locationMaps.hasOwnProperty(location.id)) {
            setTimeout(() => {
                google.maps.event.trigger(this.locationMaps[location.id], 'resize');
            }, 50);
        } else {
            this.locationMaps[location.id] = undefined;
        }
    }

    public onAfterGMapApiInit(location: Location): void {
        setTimeout(() => {
            this.locationMaps[location.id] = LocationListCardComponent.loadMap(location);
        }, 50);
    }

    public onManage(location: any): void {
        const modalRef = this.modalService.open(LocationDetailDialogComponent, {width: '500px'});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        modalRef.componentInstance.locationSpecs = this.locationSpecs;
        modalRef.componentInstance.location = Object.assign({}, location);
    }

    public onRemove(location: Location): void {
        this.alertService.open({
            title: 'xm-entity.location-list-card.delete.title',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'xm-entity.location-list-card.delete.button',
        }).subscribe((result) => {
            if (result.value) {
                this.locationService.delete(location.id).subscribe(
                    () => {
                        this.eventManager.broadcast({
                            name: 'locationListModification',
                        });
                        this.toasterService.success('xm-entity.location-list-card.delete.remove-success');
                    },
                    () => this.toasterService.error('xm-entity.location-list-card.delete.remove-error'),
                );
            }
        });
    }

    private registerListModify(): void {
        this.modificationSubscription = this.eventManager.subscribe('locationListModification',
            () => this.load());
    }

    private load(): void {
        this.locations = [];
        this.locationMaps = {};
        this.xmEntityService.find(this.xmEntityId, {embed: 'locations'})
            .subscribe((xmEntity: HttpResponse<XmEntity>) => {
                this.xmEntity = xmEntity.body;
                if (xmEntity.body.locations) {
                    this.locations = [...xmEntity.body.locations];
                }
            });
    }

}
