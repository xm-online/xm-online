
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { JsonSchemaFormService } from 'angular2-json-schema-form';

import { buildMapId, buildPinSymbol } from '../../../helpers/google-map-helper';
import { CurrentLocationOptions } from './current-location-options.model';

declare const google: any;

@Component({
    selector: 'xm-current-location-widget',
    templateUrl: 'current-location.component.html',
})
export class CurrentLocationComponent implements OnInit {

    @Input() public layoutNode: any;
    public options: CurrentLocationOptions;

    public latitude: number;
    public longitude: number;
    public mapId: string;

    constructor(private jsf: JsonSchemaFormService,
                private changeDetectorRef: ChangeDetectorRef) {
        this.mapId = buildMapId('currentLocation');
    }

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }

    public onAfterGMapApiInit(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.changeDetectorRef.detectChanges();
                this.jsf.updateValue(this, this.latitude + ',' + this.longitude);
                this.showMap({latitude: this.latitude, longitude: this.longitude});
            });
        }
    }

    public showMap(location: any): void {
        const mapOptions = {
            maxZoom: 16,
            scrollwheel: false,
        };
        const bounds = new google.maps.LatLngBounds();
        const map = new google.maps.Map(document.getElementById(this.mapId), mapOptions);
        const latLng = new google.maps.LatLng(location.latitude, location.longitude);
        const marker = new google.maps.Marker({
            position: latLng,
            icon: buildPinSymbol('#009688'),
        });
        marker.setMap(map);
        bounds.extend(latLng);
        map.fitBounds(bounds);
        map.panToBounds(bounds);
    }

}
