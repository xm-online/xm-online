import {AfterViewInit, Component, ElementRef, Renderer, Renderer2, ViewChild} from '@angular/core';
import { XmEntityService } from '../../../entities/xm-entity/xm-entity.service';
import {JhiLanguageService} from "ng-jhipster";

declare const Detector: any;
declare const THREE: any;
declare const google: any;
declare const $: any;

@Component({
    selector: 'xm-widget-mtt-earth',
    templateUrl: './xm-widget-mtt-earth.component.html',
    styleUrls: [ './xm-widget-mtt-earth.component.css' ]
})
export class XmWidgetMttEarthComponent implements AfterViewInit {

    config: any;


    @ViewChild('placeInfoContainer') placeInfoContainerRef: ElementRef;
    sphere: any;
    clouds: any;
    camera: any;
    scene: any;
    speed: any;
    width: any;
    height: any;
    renderer: any;

    constructor(
        // private injector: Injector,
        private xmEntityService: XmEntityService,
        private renderer2: Renderer2,
        private jhiLanguageService: JhiLanguageService,
    ) {
        // this.config = this.injector.get('config') || {};
        this.jhiLanguageService.addLocation('widget-mtt-earth');
    }

    ngAfterViewInit() {
        const earthEl = $('#earth');
        if (!Detector.webgl) {
            Detector.addGetWebGLMessage(earthEl);
            return;
        }

        const visualizationEl = $('#visualization');
        this.width  = visualizationEl.width() + 30;
        this.height = visualizationEl.height();

        // Earth params
        const radius = 0.5;
        const segments = 32;
        const rotation = 0;
        this.speed = 0.0005;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.01, 1000);
        this.camera.position.z = 2;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.scene.add(new THREE.AmbientLight(0x333333));

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 3, 5);
        this.scene.add(light);
        this.sphere = this.createSphere(radius, segments);
        this.sphere.rotation.y = rotation;
        this.scene.add(this.sphere);
        this.clouds = this.createClouds(radius, segments);
        this.clouds.rotation.y = rotation;
        this.scene.add(this.clouds);

        const stars = this.createStars(90, 64);
        this.scene.add(stars);
        earthEl.append(this.renderer.domElement);

        // var controls = new THREE.TrackballControls(camera);
        this.render();
    }

    render() {
        // controls.update();
        this.sphere.rotation.y += this.speed;
        this.clouds.rotation.y += this.speed;
        requestAnimationFrame(() => {
            this.render();
        });
        this.renderer.render(this.scene, this.camera);
    }

    createSphere(radius, segments) {
        return new THREE.Mesh(
            new THREE.SphereGeometry(radius, segments, segments),
            new THREE.MeshPhongMaterial( {
                map: THREE.ImageUtils.loadTexture('/assets/img/mtt-earth/2_no_clouds_4k.jpg'),
                bumpMap: THREE.ImageUtils.loadTexture('/assets/img/mtt-earth/elev_bump_4k.jpg'),
                bumpScale: 0.005,
                specularMap: THREE.ImageUtils.loadTexture('/assets/img/mtt-earth/water_4k.png'),
                specular: new THREE.Color('grey')
            })
        );
    }

    createClouds(radius, segments) {
        return new THREE.Mesh(
            new THREE.SphereGeometry(radius + 0.003, segments, segments),
            new THREE.MeshPhongMaterial( {
                map: THREE.ImageUtils.loadTexture('/assets/img/mtt-earth/fair_clouds_4k.png'),
                transparent: true
            })
        );
    }

    createStars(radius, segments) {
        return new THREE.Mesh(
            new THREE.SphereGeometry(radius, segments, segments),
            new THREE.MeshBasicMaterial( {
                map: THREE.ImageUtils.loadTexture('/assets/img/mtt-earth/galaxy_starfield.png'),
                side: THREE.BackSide
            })
        );
    }

    suggestLocation() {
        const places = [
            { reason: 'Forbes. The 21 best budget travel destinations for 2017',
              subplaces: [
                  'Northern Vietnam',
                  'Bishkek, Kyrgyzstan',
                  'Lisbon, Portugal',
                  'Seoul, South Korea',
                  'Bucharest, Romania',
                  'Cape Point, South Africa',
                  'Crete, Greece',
                  'Palawan, The Philippines',
                  'Burleigh Heads, Queensland, Australia',
                  'Porto, Portugal',
                  'Tobago, Trinidad and Tobago',
                  'Trencin, Slovakia',
                  'Luang Prabang, Laos',
                  'Cairo, Egypt',
                  'Salar de Uyuni, Bolivia',
                  'Moab, Utah',
                  'Antigua, Guatemala',
                  'Brasov, Romania',
                  'Hopkins, Belize',
                  'Copán, Honduras',
                  'Tbilisi, Georgia']
            },
            { reason: 'Lonely Planet. Best in travel 2017',
              subplaces: [
                  'Bordeaux, France',
                  'Cape Town, South Africa',
                  'Los Angeles, USA',
                  'Merida, Mexico',
                  'Ohrid, Macedonia',
                  'Pistoia, Italy',
                  'Seoul, South Korea',
                  'Lisbon, Portugal',
                  'Moscow, Russia',
                  'Portland, Oregon']
            }
        ];
        const item = places[Math.floor(Math.random() * places.length)];
        this.searchLocation(item.subplaces[Math.floor(Math.random() * item.subplaces.length)], item.reason);
    }

    searchLocation(addressLine, reason) {
        new google.maps.Geocoder().geocode( { address: addressLine }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                const location = results[0].geometry.location;
                this.pickup(location.lat(), location.lng(), results[0].formatted_address, reason);
            }
        });
    }

    pickup(lat, lng, name, reason) {
        this.placeInfoContainerRef.nativeElement.style.display = 'none';
        this.speed = 0.05;
        this.zoom(2, null, null, null);
        const counter = setInterval(() => {
            clearInterval(counter);
            const rMajor = 6.2832;
            const steps = 100;
            const xStart = this.sphere.rotation.x % rMajor;
            const xEnd = rMajor * lat / 360;
            const yStart = this.sphere.rotation.y % rMajor;
            const yEnd = rMajor / 4 - rMajor * (180 + lng) / 360;
            const xStep = (xEnd - xStart) / steps;
            const yStep = (yEnd - yStart + rMajor) / steps;

            this.speed = 0;
            this.zoom(1, xStep, yStep, () => {
                this.placeInfoContainerRef.nativeElement.querySelector('.title').textContent = name;
                this.placeInfoContainerRef.nativeElement.querySelector('.text').textContent = reason;
                this.placeInfoContainerRef.nativeElement.style.top = (this.height / 2) + 'px';
                this.placeInfoContainerRef.nativeElement.style.right = ((this.width - 300) / 2) + 'px';
                this.placeInfoContainerRef.nativeElement.style.display = 'inline';
            });
        },  1000);
    }

    zoom(z, xStep, yStep, callback) {
        let steps = 100;
        const zStart = this.camera.position.z;
        const zEnd = z;
        const zStep = (zEnd - zStart) / steps;

        if (zStep === 0) {
            return;
        }

        const counter = setInterval(() => {
            steps = steps - 1;
            this.camera.position.z += zStep;
            if (xStep) {
                this.sphere.rotation.x += xStep;
                this.clouds.rotation.x += xStep;
            }
            if (yStep) {
                this.sphere.rotation.y += yStep;
                this.clouds.rotation.y += yStep;
            }

            if (steps <= 0) {
                clearInterval(counter);
                if (callback) {
                    callback();
                }
                return;
            }
        },  10);
    }

}
