import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '..';

@Pipe({name: 'locationAddress'})
export class LocationCardNamePipe implements PipeTransform {

    constructor(private translateService: TranslateService) {
    }

    public transform(location: Location): string {
        if (!location) {
            return '';
        }

        const country = location.countryKey
            ? this.translateService.instant('xm-entity.location-detail-dialog.countries.' + location.countryKey)
            : null;

        const buildAddress = () => [
            country, location.region, location.city,
            location.addressLine1,
            location.addressLine2, location.zip,
        ].filter((item) => item).join(', ');

        return (location.name ? ` - ${location.name} - ` : ' - ') + buildAddress();
    }

}
