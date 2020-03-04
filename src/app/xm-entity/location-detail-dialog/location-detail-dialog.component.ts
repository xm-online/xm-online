import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';
import { XmEventManager } from '@xm-ngx/core';
import { XmToasterService } from '@xm-ngx/toaster';
import { Observable } from 'rxjs';
import { finalize, map, startWith } from 'rxjs/operators';

import { XmConfigService } from '../../shared';
import { LocationSpec } from '../shared/location-spec.model';
import { Location } from '../shared/location.model';
import { LocationService } from '../shared/location.service';
import { XmEntity } from '../shared/xm-entity.model';
import { ISO3166_CODES } from './iso-3166-codes';

declare let google: any;

export interface CountryOption {
    name: string;
    key: string;
}

@Component({
    selector: 'xm-location-detail-dialog',
    templateUrl: './location-detail-dialog.component.html',
    styleUrls: ['./location-detail-dialog.component.scss'],
})
export class LocationDetailDialogComponent implements OnInit {
    @Input() public xmEntity: XmEntity;
    @Input() public location: Location = {};
    @Input() public locationSpecs: LocationSpec[];

    public form: FormGroup;
    public formCountrySearch: FormControl;
    public iso3166Codes: string[] = ISO3166_CODES;
    public showLoader: boolean;
    public locations: Location[];
    public locationMap: any;
    public locationMarker: any;
    public filteredCountryOptions: Observable<CountryOption[]>;
    public countryOptions: CountryOption[];

    constructor(private activeModal: MatDialogRef<LocationDetailDialogComponent>,
                private locationService: LocationService,
                private xmToasterService: XmToasterService,
                private eventManager: XmEventManager,
                private translateService: TranslateService,
                private xmConfigService: XmConfigService,
                private fb: FormBuilder) {
    }

    public get coordinatesInvalid(): boolean {
        return this.form.controls.latitude.invalid || this.form.controls.longitude.invalid;
    }

    public applyCoordinates(setCenter: boolean = true): void {
        if (this.coordinatesInvalid || !this.locationMarker || !this.locationMap) {return; }

        const latLng = new google.maps.LatLng(this.form.controls.latitude.value, this.form.controls.longitude.value);

        this.locationMarker.setPosition(latLng);
        if (setCenter) {this.locationMap.setCenter(latLng); }
    }

    public ngOnInit(): void {
        // load the initial countries list
        this.countryOptions = this.iso3166Codes
            .map((option) => {
                return {
                    key: option,
                    name: this.translateService.instant(`xm-entity.location-detail-dialog.countries.${option}`),
                };
            });

        // init forms/form controls
        this.createForm();
        this.formCountrySearch = new FormControl();
        this.resetForm();

        // filter county select
        this.filteredCountryOptions = this.formCountrySearch.valueChanges
            .pipe(
                startWith(''),
                map((value) => this._filterCountry(value)),
            );

        this.xmConfigService.getUiConfig().subscribe((result) => {
            if (!result.entity && !result.entity.location) {return; }

            const defaultSetting = result.entity.location;

            if (this.form.controls.latitude.invalid && defaultSetting.defaultLat) {
                this.form.controls.latitude.setValue(defaultSetting.defaultLat);
                this.applyCoordinates();
            }
            if (this.form.controls.longitude.invalid && defaultSetting.defaultLng) {
                this.form.controls.longitude.setValue(defaultSetting.defaultLng);
                this.applyCoordinates();
            }
            if (this.form.controls.countryKey.invalid && defaultSetting.defaultCountryCode) {
                this.form.controls.countryKey.setValue(defaultSetting.defaultCountryCode);
            }
        });
    }

    public onAfterGMapApiInit(): void {
        this.locationMap = this.loadMap();
        this.locationMarker = this.loadMarker();
        this.applyMapHandlers();
        this.applyCoordinates();
    }

    public onConfirmSave(): void {
        if (this.xmEntity && this.xmEntity.id) {
            Object.assign(this.form.value.xmEntity, {id: this.xmEntity.id, typeKey: this.xmEntity.typeKey});
        }
        this.showLoader = true;
        if (this.form.value.id) {
            this.locationService.update(this.form.value).pipe(
                finalize(() => this.showLoader = false),
            ).subscribe(
                () => this.onSaveSuccess('xm-entity.location-detail-dialog.edit.success'),
                // TODO: error processing
                (err) => console.info(err));
        } else {
            this.locationService.create(this.form.value).pipe(
                finalize(() => this.showLoader = false),
            )
                .subscribe(
                    () => this.onSaveSuccess('xm-entity.location-detail-dialog.add.success'),
                    // TODO: error processing
                    (err) => console.info(err));
        }
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }

    private loadMap(): any {
        const mapOptions = {
            zoom: 8,
            center: {
                lat: 0,
                lng: 0,
            },
        };

        return new google.maps.Map(document.querySelector('.location-detail-dialog__map'), mapOptions);
    }

    private loadMarker(): any {
        return new google.maps.Marker({
            draggable: true,
            position: {
                lat: 0,
                lng: 0,
            },
            map: this.locationMap,
        });
    }

    private applyMapHandlers(): void {
        google.maps.event.addListener(this.locationMarker, 'dragend', (e) => {
            this.form.controls.latitude.setValue(e.latLng.lat());
            this.form.controls.longitude.setValue(e.latLng.lng());
        });
        google.maps.event.addListener(this.locationMap, 'click', (e) => {
            this.form.controls.latitude.setValue(e.latLng.lat());
            this.form.controls.longitude.setValue(e.latLng.lng());
            this.applyCoordinates(false);
        });
    }

    private createForm(): void {
        const regCoordinate = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;

        this.form = this.fb.group({
            id: [null],
            typeKey: [null, Validators.required],
            name: [null, Validators.required],
            countryKey: ['', Validators.required],
            zip: [null],
            region: [null],
            city: [null],
            addressLine1: [null],
            addressLine2: [null],
            latitude: [null, [Validators.required, Validators.pattern(regCoordinate)]],
            longitude: [null, [Validators.required, Validators.pattern(regCoordinate)]],
            xmEntity: this.fb.group({}),
        });
    }

    private resetForm(): void {
        if (!this.location.typeKey && this.locationSpecs.length) {
            this.location.typeKey = this.locationSpecs[0].key;
        }
        this.location.xmEntity = {};
        this.location.xmEntity.id = this.xmEntity.id;
        this.location.xmEntity.typeKey = this.xmEntity.typeKey;

        this.form.reset({...this.location});
    }

    private onSaveSuccess(text: string): void {
        // TODO: use constant for the broadcast and analyse listeners
        this.eventManager.broadcast({name: 'locationListModification'});
        this.activeModal.close(true);
        this.xmToasterService.create({type: 'success', text}).subscribe();
    }

    private _filterCountry(value: string): CountryOption[] {
        const filterValue = value.toLowerCase();

        return this.countryOptions
            // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
            .filter((option) => option.name.toLowerCase().indexOf(filterValue) === 0);
    }
}
