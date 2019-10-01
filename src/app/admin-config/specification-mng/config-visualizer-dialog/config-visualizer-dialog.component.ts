import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Principal } from '../../../shared/auth/principal.service';
import { saveFile } from '../../../shared/helpers/file-download-helper';

import * as nomnoml from 'nomnoml';

declare let YAML: any;
declare let skanaar: any;

@Component({
    selector: 'xm-config-visualizer-dialog',
    templateUrl: './config-visualizer-dialog.component.html',
    styleUrls: ['./config-visualizer-dialog.component.scss'],
})
export class ConfigVisualizerDialogComponent implements OnInit, AfterViewInit {

    @Input() entitySpecification: string;
    zoomLevel = 0;
    offset = {x:  0, y: 0};
    source: any;
    mouseDownPoint: any;

    @ViewChild('canvas', {static: false}) canvas: ElementRef;
    @ViewChild('downloadLink', {static: false}) downloadLink: ElementRef;
    @ViewChild('downloadLinkSvg', {static: false}) downloadLinkSvg: ElementRef;
    @ViewChild('canvasHolder', {static: false}) canvasHolder: ElementRef;

    constructor(private activeModal: NgbActiveModal,
                public principal: Principal) {
    }

    ngOnInit() {
        this.source = this.getSource();
    }

    ngAfterViewInit() {
        setTimeout(() => {this.sourceChanged(); }, 100);
    }

    onCancel() {
        this.activeModal.dismiss('cancel');
    }

    sourceChanged() {
        const canvasElement = document.getElementById('canvas');
        try {
            const superSampling = window.devicePixelRatio || 1;
            const scale = superSampling * Math.exp(this.zoomLevel / 10);
            nomnoml.draw(canvasElement, this.source, scale);
            this.positionCanvas(canvasElement, superSampling, this.offset);
        } catch (e) {
            console.log(e); // tslint:disable-line
        }
    }

    positionCanvas(rect, superSampling, offset) {
        const canvasElement = this.canvas.nativeElement;
        const canvasHolder = this.canvasHolder.nativeElement;
        const w = rect.width / superSampling;
        const h = rect.height / superSampling;
        canvasElement.style.top = (canvasHolder.offsetHeight - h) / 2 + offset.y + 'px';
        canvasElement.style.left = (canvasHolder.offsetWidth  - w) / 2 + offset.x + 'px';
        canvasElement.style.width = w + 'px';
        canvasElement.style.height = h + 'px';
    }

    magnifyViewport(diff) {
        this.zoomLevel = Math.min(10, this.zoomLevel + diff);
        this.sourceChanged();
    }

    resetViewport() {
        this.zoomLevel = 1;
        this.offset = {x: 0, y: 0};
        this.sourceChanged();
    }

    doDownloadPng(name) {
        this.downloadLink.nativeElement.href = this.canvas.nativeElement.toDataURL('image/png');
        this.downloadLink.nativeElement.download = `${name}.png`;
        this.downloadLink.nativeElement.click();
    }

    doDownloadSvg(name) {
        const svg = nomnoml.renderSvg(this.source, this.canvas.nativeElement);
        const blob = new Blob([svg], {type: 'image/svg+xml'});
        const filename = name;
        saveFile(blob, filename, 'image/svg+xml');
    }

    mouseDown(e) {
        this.mouseDownPoint = skanaar.vector.diff({ x: e.pageX, y: e.pageY }, this.offset);
    }

    mouseUp() {
        this.mouseDownPoint = null;
    }

    mouseMove(e) {
        if (this.mouseDownPoint) {
            this.offset = skanaar.vector.diff({ x: e.pageX, y: e.pageY }, this.mouseDownPoint);
            this.sourceChanged();
        }
    }

    wheel(evant) {
        this.zoomLevel = Math.min(10, this.zoomLevel - (evant.deltaY < 0 ? -1 : 1));
        this.sourceChanged();
    }

    private typeToString(type) {
        let result = '';
        let typeKey = type.key;
        if (type.key.includes('.')) {
            const keys = type.key.split('.');
            typeKey = keys.pop();
            const componentKey = keys.pop();
            result += `[${componentKey}]<:--[${typeKey}]\n`;
        }
        const dataSpec = this.dataSpecToString(type.dataSpec);
        const functions = this.functionsToString(type.functions);
        const states = this.statesToClassifiers(type.states).join('\n');
        const links = this.linksToClassifiers(type.links, typeKey).join('\n');
        result += `[${typeKey}|${dataSpec}|${functions}|${states}]\n${links}`;
        return result;
    }

    private dataSpecToString(dataSpec) {
        const terms = [];
        if (dataSpec) {
            dataSpec = JSON.parse(dataSpec);
            dataSpec.properties && Object.keys(dataSpec.properties).forEach((k) => {
                terms.push(`${k}: ${dataSpec.properties[k].type}`);
            });
        }
        return terms.join(';');
    }

    private functionsToString(functions) {
        const terms = [];
        if (functions) {
            functions.forEach((f) => {
                terms.push(`${f.key}()`);
            });
        }
        return terms.join(';');
    }

    private statesToClassifiers(states) {
        const classifiers = [];
        if (states) {
            states.forEach((s) => {
                classifiers.push(`  [<state> ${s.key}]`);
                if (s.next) {
                    s.next.forEach((n) => {
                        classifiers.push(`  [<state> ${s.key}]->[<state> ${n.stateKey}]`);
                    });
                }
            });
        }
        return classifiers;
    }

    private linksToClassifiers(links, typeKey) {
        const classifiers = [];
        if (links) {
            links.map((l) => l.typeKey).filter((v, i, a) => a.indexOf(v) === i).forEach((tk) => {
                classifiers.push(`[${tk.split('.').pop()}]<-[${typeKey}]`);
            });
        }
        return classifiers;
    }

    private getSource() {
        const spec = YAML.parse(this.entitySpecification);
        let source = '';
        spec.types.forEach((t) => {
            source += `${this.typeToString(t)}\n`;
        });
        source += '#fill: #f3f3f3; #b2dfdb\n';
        source += '#stroke: #009688\n';
        source += '#zoom: 0.5\n';
        return source;
    }
}
