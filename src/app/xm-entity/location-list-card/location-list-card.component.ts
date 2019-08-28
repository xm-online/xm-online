import {HttpResponse} from '@angular/common/http';
import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {JhiEventManager} from 'ng-jhipster';

import {Subscription} from 'rxjs';
import {Principal} from '../../shared/auth/principal.service';
import {LocationDetailDialogComponent} from '../location-detail-dialog/location-detail-dialog.component';
import {LocationSpec} from '../shared/location-spec.model';
import {Location} from '../shared/location.model';
import {LocationService} from '../shared/location.service';
import {XmEntity} from '../shared/xm-entity.model';
import {XmEntityService} from '../shared/xm-entity.service';

declare let $: any;
declare let google: any;
declare let swal: any;

@Component({
    selector: 'xm-location-list-card',
    templateUrl: './location-list-card.component.html',
    styleUrls: ['./location-list-card.component.scss']
})
export class LocationListCardComponent implements OnInit, OnChanges, OnDestroy {

    private modificationSubscription: Subscription;

    @Input() xmEntityId: number;
    @Input() locationSpecs: LocationSpec[];
    @Input() entityUiConfig: any;

    xmEntity: XmEntity;
    locations: Location[];
    locationMaps: any;
    noDataText: any;

    private static loadMap(location: Location): any {
        if (location.latitude && location.longitude) {
            const latLng = new google.maps.LatLng(location.latitude, location.longitude);
            const mapOptions = {
                zoom: 8,
                center: latLng,
                scrollwheel: false
            };

            const map = new google.maps.Map(document.getElementById('location-map-' + location.id), mapOptions);
            const marker = new google.maps.Marker({
                position: latLng,
                title: location.name
            });
            marker.setMap(map);
            return map;
        }
    }

    constructor(private xmEntityService: XmEntityService,
                private locationService: LocationService,
                private modalService: NgbModal,
                private eventManager: JhiEventManager,
                private translateService: TranslateService,
                public principal: Principal) {
    }

    ngOnInit() {
        this.registerListModify();
        if (this.entityUiConfig && this.entityUiConfig.locations && this.entityUiConfig.locations.noData) {
            this.noDataText = this.entityUiConfig.locations.noData;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.xmEntityId && changes.xmEntityId.previousValue !== changes.xmEntityId.currentValue) {
            this.load();
        }
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.modificationSubscription);
    }

    private registerListModify() {
        this.modificationSubscription = this.eventManager.subscribe('locationListModification', (response) => this.load());
    }

    private load() {
        this.locations = [];
        this.locationMaps = {};
        this.xmEntityService.find(this.xmEntityId, {'embed': 'locations'}).subscribe((xmEntity: HttpResponse<XmEntity>) => {
            this.xmEntity = xmEntity.body;
            if (xmEntity.body.locations) {
                this.locations = [...xmEntity.body.locations];
            }
        });
    }

    getLocationSpec(location: Location) {
        return this.locationSpecs.filter((ls) => ls.key === location.typeKey).shift();
    }

    getPrintAddress(location: Location) {
        const country = location.countryKey ? this.translateService.instant('xm-entity.location-detail-dialog.countries.' +
            location.countryKey) : null;
        return $.grep([country, location.region, location.city, location.addressLine1, location.addressLine2, location.zip],
            Boolean).join(', ');
    }

    onCollapseMap(location: Location) {
        if (this.locationMaps.hasOwnProperty(location.id)) {
            setTimeout(() => {
                google.maps.event.trigger(this.locationMaps[location.id], 'resize');
            }, 50);
        } else {
            this.locationMaps[location.id] = undefined;
        }
    }

    onAfterGMapApiInit(location: Location) {
        setTimeout(() => {
            this.locationMaps[location.id] = LocationListCardComponent.loadMap(location);
        }, 50);
    }

    onManage(location) {
        const modalRef = this.modalService.open(LocationDetailDialogComponent, {size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        modalRef.componentInstance.locationSpecs = this.locationSpecs;
        modalRef.componentInstance.location = Object.assign({}, location);
    }

    onRemove(location: Location) {
        swal({
            title: this.translateService.instant('xm-entity.location-list-card.delete.title'),
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-raised-button btn-primary',
            cancelButtonClass: 'btn mat-raised-button',
            confirmButtonText: this.translateService.instant('xm-entity.location-list-card.delete.button')
        }).then((result) => {
            if (result.value) {
                this.locationService.delete(location.id).subscribe(
                    () => {
                        this.eventManager.broadcast({
                            name: 'locationListModification'
                        });
                        this.alert('success', 'xm-entity.location-list-card.delete.remove-success');
                    },
                    () => this.alert('error', 'xm-entity.location-list-card.delete.remove-error')
                );
            }
        });
    }

    private alert(type, key) {
        swal({
            type: type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary'
        });
    }

}
