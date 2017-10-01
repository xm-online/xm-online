import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {XmEntity} from "../../entities/xm-entity/xm-entity.model";
import {Location} from '../../entities/location/location.model';
import {EntityLocationDialogComponent} from "./entity-location-dialog.component";
import {EntityLocationDeleteDialogComponent} from "./entity-location-delete-dialog.component";
import {Subscription} from "rxjs/Subscription";
import {EventManager, JhiLanguageService} from "ng-jhipster";
import {XmEntitySpecService} from "../../shared/spec/spec.service";
import {XmEntityService} from "../../entities/xm-entity/xm-entity.service";

declare let google: any;
declare let $: any;

@Component({
    selector: 'xm-location-cmp',
    templateUrl: './entity-location.component.html'
})
export class EntityLocationComponent implements OnInit {

    @Input() xmEntityId: number;

    xmEntity: XmEntity;
    locationTypes: any;
    locations: Location[];
    private maps: any = {};
    private modifySubscription: Subscription;

    constructor(
        private eventManager: EventManager,
        private modalService: NgbModal,
        private xmEntitySpecService: XmEntitySpecService,
        private xmEntityService: XmEntityService,
        private jhiLanguageService: JhiLanguageService
    ) {
        this.registerListModify();
        this.jhiLanguageService.addLocation('xmEntity');
    }

    ngOnInit() {
        this.load()
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.modifySubscription);
    }

    private registerListModify() {
        this.modifySubscription = this.eventManager.subscribe('locationListModification', (response) => this.load());
    }

    private load() {
        this.xmEntityService.find(this.xmEntityId)
            .subscribe(xmEntity => {
                const typeKey = xmEntity.typeKey;

                this.xmEntity = xmEntity;
                this.locationTypes = this.xmEntitySpecService.getLocations(typeKey);
                this.locations = xmEntity.locations;
            })
        ;
    }

    onRemove(location) {
        return this.openDialog(EntityLocationDeleteDialogComponent, modalRef => {
            modalRef.componentInstance.location = location;
        });
    }

    onManage(xmEntity, location?) {
        return this.openDialog(EntityLocationDialogComponent, modalRef => {
            modalRef.componentInstance.locationTypes = Object.keys(this.locationTypes).map(key => this.locationTypes[key]);
            if (location) {
                modalRef.componentInstance.location = Object.assign({}, location);
                // modalRef.componentInstance.location.xmEntity = xmEntity;
            }
        });
    }

    private openDialog(dialogClass, operation, options?) {
        const modalRef = this.modalService.open(dialogClass, options ? options : {});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        operation(modalRef);
        return modalRef;
    }

    getPrintAddress(location: Location) {
        return $.grep([location.country, location.region, location.city, location.addressLine1,
            location.addressLins2, location.zip], Boolean).join(', ');
    }

    private loadMap(location: Location):any {
        if (location.latitude && location.longitude) {
            const latLng = new google.maps.LatLng(location.latitude, location.longitude);
            const mapOptions = {
                zoom: 8,
                center: latLng,
                // we disable de scroll over the map, it is a really annoing when you scroll through page
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

    onCollapseMap(location: Location) {
        setTimeout(() => {
            let id = location.id;
            location.isView = !location.isView;
            if (location.isView) {
                if (this.maps.hasOwnProperty(id)) {
                    google.maps.event.trigger(this.maps[id], 'resize');
                } else {
                    let map: any = this.loadMap(location);
                    map && (this.maps[id] = map);
                }
            }
        });
    }

}
