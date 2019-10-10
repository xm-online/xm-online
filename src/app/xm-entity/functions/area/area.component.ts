import { AfterViewInit, Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { buildMapId } from '../../../shared/helpers/google-map-helper';
import { FunctionContext } from '../../shared/function-context.model';
import { FunctionContextService } from '../../shared/function-context.service';
import { XmEntity } from '../../shared/xm-entity.model';
import { OsmPolygonDialogComponent } from './osm-polygon-dialog.component';

declare let google: any;
declare let window: any;
declare let L: any;

@Component({
    selector: 'xm-area',
    templateUrl: './area.component.html',
    styleUrls: ['./area.component.scss']
})
export class AreaComponent implements AfterViewInit {

    private map: any;
    private gmLayer: any;
    private drawnItems: any;
    private drawControl: any;

    @Input() xmEntity: XmEntity;
    @Input() functionContext: FunctionContext;

    mapId: string;
    context: FunctionContext;

    constructor(private functionContextService: FunctionContextService,
                private modalService: NgbModal) {
        this.mapId = buildMapId('area');
        this.context = {};
        this.context.key = this.mapId;
        this.context.typeKey = 'AREA';
    }

    ngAfterViewInit() {
        this.init();
    }

    private init() {
        this.context.xmEntity = this.xmEntity;
        if (this.functionContext) {
            Object.assign(this.context, this.functionContext);
        }
        setTimeout(() => {
            this.map = L.map(this.mapId, {
                closePopupOnClick: false
            }).setView([50, 30.2], 8);
            this.map.scrollWheelZoom.disable();
            L.control.scale({imperial: false}).addTo(this.map);
            this.initLayers();
            this.initDrawInterface();
            this.attachEventHandlers();
            if (this.functionContext && this.functionContext.data && this.functionContext.data.polygons) {
                this.drawPolygons(this.functionContext.data.polygons);
            }
        }, 500);
    }

    private initLayers() {
        this.gmLayer = L.gridLayer.googleMutant({
            type: 'roadmap'
        });
        this.map.addLayer(this.gmLayer);
        this.drawnItems = new L.FeatureGroup();
        this.map.addLayer(this.drawnItems);
    }

    private initDrawInterface() {
        if (!this.map) {
            return;
        }
        this.drawControl = new L.Control.Draw({
            draw: {
                polyline: false,
                polygon: {
                    allowIntersection: false,
                    shapeOptions: {
                        color: '#009688'
                    }
                },
                rectangle: {
                    shapeOptions: {
                        color: '#009688'
                    }
                },
                circle: false,
                marker: false
            },
            edit: {
                featureGroup: this.drawnItems,
                edit: true,
                remove: true
            }
        });
        this.map.addControl(this.drawControl);
    }

    private attachEventHandlers() {
        const self = this;
        this.map.on('draw:created', function (e) {
            self.drawnItems.addLayer(e.layer);
            self.saveFunction(self.drawnItems);

        });

        this.map.on('draw:edited', function () {
            self.saveFunction(self.drawnItems);
        });

        this.map.on('draw:deleted', function () {
            self.saveFunction(self.drawnItems);
        });

    }

    private drawPolygons(list) {
        list.forEach(item => {
            const layer = L.polygon(
                item.paths.map(el => [el.lat, el.lng]),
                {fillColor: '#009688', fillOpacity: 0.6, opacity: 1, weight: 3, color: '#009688'}
            );
            this.drawnItems.addLayer(layer);
        });
        this.map.fitBounds(this.drawnItems.getBounds(), {padding: [1, 1]});
    }

    private saveFunction(options: any) {
        const data = {polygons: []};
        for (const layerName of Object.keys(options._layers)) {
            const layer = options._layers[layerName];
            data.polygons.push({paths: layer._latlngs[0]});
        }
        this.context.data = data;
        if (this.context.id) {
            this.context.updateDate = new Date().toJSON();
            this.functionContextService.update(this.context).subscribe();
        } else {
            this.context.description = 'description';
            this.context.startDate = new Date().toJSON();
            this.context.updateDate = new Date().toJSON();
            this.functionContextService.create(this.context).subscribe();
        }
    }

    public onClickAddPolygon(): void {
        const self = this;
        const modalRef = this.modalService.open(OsmPolygonDialogComponent, {backdrop: 'static'});
        modalRef.componentInstance.addPolygonInternal = (polygon) => {
            const layer = L.polygon(
                polygon.map(el => [el.lat, el.lon]),
                {fillColor: '#009688', fillOpacity: 0.6, opacity: 1, weight: 3, color: '#009688'}
            );
            self.drawnItems.addLayer(layer);
            self.saveFunction(self.drawnItems);
            self.map.fitBounds(this.drawnItems.getBounds(), {padding: [1, 1]});
        };
    }

}
