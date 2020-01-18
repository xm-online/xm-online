import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Principal } from '../../../shared/auth/principal.service';
import { OverpassApiService } from './overpass-api.service';

@Component({
    selector: 'xm-osm-polygon-dialog',
    templateUrl: './osm-polygon-dialog.component.html',
})
export class OsmPolygonDialogComponent {

    public showLoader: boolean;
    public relations: any[];

    constructor(public principal: Principal,
                public activeModal: NgbActiveModal,
                private overpassApi: OverpassApiService) {
    }

    public addPolygonInternal(..._args: any): any {
        console.info('TODO: refactor', _args);
    }

    public search(searchString: string): void {
        if (searchString && searchString.length > 3) {
            this.showLoader = true;
            this.overpassApi.getBoundariesByName(searchString).subscribe((body) => {
                this.relations = body.elements;
            }, (err) => {
                console.info(err);
            }, () => {
                this.showLoader = false;
            });
        }
    }

    public addPolygon(rel: any): void {
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
            console.info(err);
        }, () => {
            this.activeModal.dismiss('cancel');
        });
    }

    public clear(): void {
        this.activeModal.dismiss('cancel');
    }

}
