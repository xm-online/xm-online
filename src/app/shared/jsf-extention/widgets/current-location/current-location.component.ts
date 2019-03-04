import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { JsonSchemaFormService } from 'angular2-json-schema-form';

import { buildMapId, buildPinSymbol } from '../../../helpers/google-map-helper';
import { CurrentLocationOptions } from './current-location-options.model';

declare const google: any;

@Component({
    selector: 'xm-current-location-widget',
    templateUrl: 'current-location.component.html'
})
export class CurrentLocationComponent implements OnInit {

    @Input() layoutNode: any;
    options: CurrentLocationOptions;

    latitude: number;
    longitude: number;
    mapId: string;

    constructor(private jsf: JsonSchemaFormService,
                private changeDetectorRef: ChangeDetectorRef) {
        this.mapId = buildMapId('currentLocation');
    }

    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }

    onAfterGMapApiInit() {
        if (!!navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.changeDetectorRef.detectChanges();
                this.jsf.updateValue(this, this.latitude + ',' + this.longitude);
                this.showMap({latitude: this.latitude, longitude: this.longitude});
            });
        }
    }

    showMap(location) {
        const mapOptions = {
            maxZoom: 16,
            scrollwheel: false
        };
        const bounds = new google.maps.LatLngBounds();
        const map = new google.maps.Map(document.getElementById(this.mapId), mapOptions);
        const latLng = new google.maps.LatLng(location.latitude, location.longitude);
        const marker = new google.maps.Marker({
            position: latLng,
            icon: buildPinSymbol('#009688')
        });
        marker.setMap(map);
        bounds.extend(latLng);
        map.fitBounds(bounds);
        map.panToBounds(bounds);
    }

}
