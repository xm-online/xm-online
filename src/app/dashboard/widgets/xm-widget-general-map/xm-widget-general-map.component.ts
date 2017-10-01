import {Component, Injector, Input, OnInit} from '@angular/core';
import {Response} from '@angular/http';
import {XmEntityService} from '../../../entities/xm-entity/xm-entity.service';

declare var google: any;
declare var $: any;

@Component({
    selector: 'xm-widget-general-map',
    templateUrl: './xm-widget-general-map.component.html'
})
export class XmWidgetGeneralMapComponent implements OnInit {

    name: any;
    config: any;
    groups: any[];
    currentGroup: any;

    constructor(private injector: Injector,
                private xmEntityService: XmEntityService,) {
        this.config = this.injector.get('config') || {};
        this.name = this.config.name;
        this.groups = this.config.groups;
        this.currentGroup = this.groups[0];
    }

    ngOnInit() {
        this.initMap();
    }

    showGroup(group) {
        this.currentGroup = group;
        this.initMap();
    }

    initMap() {
        this.xmEntityService.search({
            query: this.currentGroup.query
        }).subscribe(
            (res: Response) =>
                this.onShowMap(res.json()),
            (res: Response) =>
                console.log('Error')
        );
    }

    onShowMap(data: any[]) {
        const mapOptions = {
            scrollwheel: false,
        };

        const bounds = new google.maps.LatLngBounds();
        const map = new google.maps.Map(document.getElementById('regularMap'), mapOptions);
        for (const xmEntity of data) {
            const locations: any[] = xmEntity.locations;
            for (const location of locations) {
                if ((location.latitude > -90 && location.latitude < 90) && (location.longitude > -180 && location.longitude < 180)) {
                    // TODO: it should be filter by location type based on widget config
                    const loc = new google.maps.LatLng(location.latitude, location.longitude);
                    const marker = new google.maps.Marker({
                        position: loc,
                        icon: this.pinSymbol(this.currentGroup.color)
                    });

                    marker.setMap(map);
                    bounds.extend(loc);

                    const infowindow = new google.maps.InfoWindow({
                        content: xmEntity.name
                    });
                    marker.addListener('click', function () {
                        infowindow.open(map, marker);
                    });
                }
            }
        }

        map.fitBounds(bounds);
        map.panToBounds(bounds);
    }

    pinSymbol(color) {
        return {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 1,
            scale: 1,
            labelOrigin: new google.maps.Point(0, -29)
        };
    }

}
