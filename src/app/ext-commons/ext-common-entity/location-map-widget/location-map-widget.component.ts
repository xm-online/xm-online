import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { buildMapId, buildPinSymbol } from '../../../shared/helpers/google-map-helper';
import { XmEntity, XmEntityService } from '../../../xm-entity/';

declare const google: any;
declare const MarkerClusterer: any;

@Component({
    selector: 'xm-location-map-widget',
    templateUrl: './location-map-widget.component.html',
    styleUrls: ['./location-map-widget.component.scss'],
})
export class LocationMapWidgetComponent implements OnInit {

    public mapId: string;
    public name: any;
    public config: any;
    public groups: any[];
    public currentGroup: any;
    public markerClusterer: any;
    public gMapApiReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private xmEntityService: XmEntityService) {
    }

    public ngOnInit(): void {
        this.mapId = buildMapId('generalMap');
        this.name = this.config.name;
        this.groups = this.config.groups;
        this.currentGroup = this.groups[0];
        this.initMap();
    }

    public showGroup(group: any): void {
        this.currentGroup = group;
        this.initMap();
    }

    public initMap(): void {
        this.xmEntityService.search({
            query: this.currentGroup.query,
            size: this.currentGroup.size ? this.currentGroup.size : 20,
        }).subscribe(
            (res: HttpResponse<XmEntity[]>) => {
                this.gMapApiReady$
                    .pipe(
                        filter((status) => status === true),
                    )
                    .subscribe(() => this.onShowMap(res.body));
            },
            () => console.warn('Error'),
        );
    }

    public onAfterGMapApiInit(): void {
        this.gMapApiReady$.next(true);
    }

    public onShowMap(data: any[]): void {
        if (this.markerClusterer) {
            this.markerClusterer.clearMarkers();
        }
        const mapOptions = {
            scrollwheel: false,
        };

        const bounds = new google.maps.LatLngBounds();
        const map = new google.maps.Map(document.getElementById(this.mapId), mapOptions);
        const markers = [];
        for (const xmEntity of data) {
            const locations: any[] = xmEntity.locations;

            for (const location of locations) {
                if ((location.latitude > -90 && location.latitude < 90)
                    && (location.longitude > -180 && location.longitude < 180)) {
                    // TODO: it should be filter by location type based on widget config
                    const loc = new google.maps.LatLng(location.latitude, location.longitude);
                    const marker = new google.maps.Marker({
                        position: loc,
                        icon: buildPinSymbol(this.currentGroup.color),
                    });

                    markers.push(marker);
                    marker.setMap(map);
                    bounds.extend(loc);

                    const infowindow = new google.maps.InfoWindow({
                        content: xmEntity.name,
                    });
                    marker.addListener('click', () => infowindow.open(map, marker));
                }
            }
        }
        this.markerClusterer = new MarkerClusterer(map, markers, {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
        });
        map.fitBounds(bounds);
        map.panToBounds(bounds);
    }

}
