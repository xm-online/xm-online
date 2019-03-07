import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Principal} from '../../../shared/auth/principal.service';
import {OverpassApiService} from './overpass-api.service';

@Component({
    selector: 'xm-osm-polygon-dialog',
    templateUrl: './osm-polygon-dialog.component.html'
})
export class OsmPolygonDialogComponent {

    showLoader: boolean;
    relations: any[];
    addPolygonInternal = new Function();

    constructor(public principal: Principal,
                public activeModal: NgbActiveModal,
                private overpassApi: OverpassApiService) {
    }

    search(searchString) {
        if (searchString && searchString.length > 3) {
            this.showLoader = true;
            this.overpassApi.getBoundariesByName(searchString).subscribe((body) => {
                this.relations = body.elements;
            }, (err) => {
                console.log(err);
            }, () => {
                this.showLoader = false;
            });
        }
    }

    addPolygon(rel) {
        this.overpassApi.getRelGeom(rel.id).subscribe((body) => {
            const polygon = [];
            const members = body.elements.shift().members
                .filter((m) => m.geometry && m.geometry.length > 0 && m.type === 'way' && m.role === 'outer');
            for (const member of members) {
                const last = polygon.length > 0 ? polygon[polygon.length - 1] : null;
                const currentFirst = member.geometry[0];
                const currentLast = member.geometry[member.geometry.length - 1];
                if (!last) {
                    polygon.push(...member.geometry);
                } else if (last.lat === currentFirst.lat && last.lon === currentFirst.lon) {
                    polygon.push(...member.geometry);
                } else if (last.lat === currentLast.lat && last.lon === currentLast.lon) {
                    polygon.push(...member.geometry.reverse());
                } else {
                    polygon.push(...member.geometry);
                }
            }
            this.addPolygonInternal(polygon);
        }, (err) => {
            console.log(err);
        }, () => {
            this.activeModal.dismiss('cancel');
        });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

}
