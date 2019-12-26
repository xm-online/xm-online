import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import { LocalStorageService } from 'ngx-webstorage';
import { XmConfigService } from '../../shared/spec/config.service';
import { TranslationService } from './translation.service';

@Component({
    selector: 'xm-translation',
    templateUrl: './translation.component.html',
    styles: [],
})
export class TranslationComponent implements OnInit, AfterViewInit {

    public localization: any = {};
    public settings: any = {};
    public missedTranslations: any[] = [];

    public originalTranslations: any = {};
    public timer: any;
    public editingPropery: any = {};

    constructor(private localStorage: LocalStorageService,
                private service: TranslationService,
                private xmConfigService: XmConfigService) {
        const translationComponentState = localStorage.retrieve('translationComponentState');
        if (translationComponentState) {
            this.localization = translationComponentState.localization;
            this.settings = translationComponentState.settings;
            this.missedTranslations = translationComponentState.missedTranslations;
            this.originalTranslations = translationComponentState.originalTranslations;
        } else {
            this.loadLangFiles();
            this.loadMissedTranslations();
        }
    }

    public loadLangFiles(): void {
        const self = this;
        this.service.getFile('/i18n/settings.json').subscribe((result) => {
            self.settings = result;
            const localization = {};

            this.xmConfigService.getUiConfig().subscribe((uiConfig) => {
                let langs = result.langs;
                if (uiConfig.langs) {
                    langs = uiConfig.langs;
                }

                self.settings.langs = langs;

                langs.forEach((lang) => {
                    result.locations.forEach((location) => {

                        if (!localization[location]) {
                            localization[location] = {};
                        }

                        this.service.getFile(`/i18n/${lang}/${location}.json`).subscribe((result) => {
                            this.originalTranslations[`${lang}/${location}`] = result;
                            const properties = this.toPropertyList(result, '');

                            for (const property in properties) {
                                const locationTranlsations = localization[location];
                                if (!locationTranlsations[property]) {
                                    locationTranlsations[property] = {};
                                }
                                locationTranlsations[property][lang] = properties[property];
                            }

                            clearTimeout(this.timer);
                            this.timer = setTimeout(function () { self.mapToProperyArray(localization); }, 500);

                        });
                    });
                });

            });
        });
    }

    public startEdit(property): void {
        this.editingPropery.editing = false;
        property.editing = true;
        this.editingPropery = property;
    }

    public onChangePropery($event, property, lang): void {
        property.langs[lang] = $event.target.value;
        this.saveState();
    }

    public addTranslationToFile(i, missedTranslation): void {
        this.missedTranslations.splice(i, 1);
        this.localization[missedTranslation.targetFile].push({
            property: missedTranslation.key,
            langs: {en: missedTranslation.defaultValue},
        });
        this.saveState();
    }

    public translate(property, lang): void {
        this.service.translate(lang, property.langs['en'])
            .done((result) => {
                property.langs[lang] = result.data.translations[0].translatedText;
            });
        this.saveState();
    }

    public translateAllTo(lang): void {
        let delay = 0;

        for (const location in this.localization) {
            const properties = this.localization[location];
            let tmpSource = [];
            for (let i = 1; i <= properties.length; i++) {
                tmpSource.push(properties[i - 1]);
                if (i % 20 === 0 || i == properties.length) {
                    this.translateProperties(tmpSource, lang, delay);
                    tmpSource = [];
                    delay = delay + 500;
                }
            }
        }
    }

    public translateLocationTo(location, lang): void {
        const properties = this.localization[location];
        let tmpSource = [];
        let delay = 0;
        for (let i = 1; i <= properties.length; i++) {
            tmpSource.push(properties[i - 1]);
            if (i % 20 === 0 || i == properties.length) {
                this.translateProperties(tmpSource, lang, delay);
                tmpSource = [];
                delay = delay + 500;
            }
        }
    }

    public loadMissedTranslations(): void {
        this.service.getFile('/i18n/missedTranslations.json').subscribe((result) => {

            const uniqMissedTranslation = {};

            result.forEach((item) => {
                if (!uniqMissedTranslation[item.key]) {
                    uniqMissedTranslation[item.key] = item;
                } else {
                    item.langFiles.forEach((lFile) => uniqMissedTranslation[item.key].langFiles.push(lFile));
                }
                uniqMissedTranslation[item.key].langFiles.push('global');
            });

            const rezArray = [];
            for (const key in uniqMissedTranslation) {
                uniqMissedTranslation[key].langFiles = new Set(uniqMissedTranslation[key].langFiles);
                rezArray.push(uniqMissedTranslation[key]);
                uniqMissedTranslation[key].targetFile = 'global';
            }

            this.missedTranslations = rezArray;
        });
    }

    public toPropertyList(translations, path): {} {
        const properties = {};
        for (const trKey in translations) {
            if (typeof translations[trKey] === 'object') {
                const list = this.toPropertyList(translations[trKey], path + '.' + trKey);
                for (const key in list) {
                    properties[key] = list[key];
                }
            } else {
                properties[path.substring(1) + '.' + trKey] = translations[trKey];
            }
        }
        return properties;
    }

    public ngOnInit(): void {

    }

    public ngAfterViewInit(): void {
    }

    public resetLocalStorage(): void {
        if (confirm('Are you sure you want to reset all changes?')) {
            this.localStorage.clear('translationComponentState');
            window.location.reload();
        }
    }

    public zipTranslations(): void {
        const zip = new JSZip();
        this.settings.langs.forEach((lang) => {
            const img = zip.folder(lang);
            for (const location in this.localization) {
                const translations = {};
                for (const tr of this.localization[location]) {
                    this.assignProperty(translations, this.getKeyPath(lang, location, tr.property), tr.langs[lang]);
                }

                img.file(location + '.json', JSON.stringify(translations, null, 4));
            }
        });

        zip.generateAsync({type: 'blob'})
            .then(function (content) {
                // see FileSaver.js
                FileSaver.saveAs(content, 'i18n.zip');
            });
    }

    private saveState(): void {
        this.localStorage.store('translationComponentState', {
            localization: this.localization,
            settings: this.settings,
            missedTranslations: this.missedTranslations,
            originalTranslations: this.originalTranslations,
        });
    }

    private mapToProperyArray(localization): void {
        const resultLocalization = {};
        for (const location in localization) {
            if (!resultLocalization[location]) {
                resultLocalization[location] = [];
            }
            for (const property in localization[location]) {
                resultLocalization[location].push({
                    property,
                    langs: localization[location][property],
                });
            }
        }
        this.localization = resultLocalization;
        this.saveState();
    }

    private translateProperties(props: any, lang, delay): void {
        const self = this;
        const properties = props;
        const sources = [];
        setTimeout(function () {
            properties.forEach((property) => {
                sources.push(property.langs['en']);
            });
            self.service.translate(lang, sources)
                .done((result) => {
                    let i = 0;
                    properties.forEach((property) => {
                        property.langs[lang] = result.data.translations[i].translatedText;
                        i++;
                    });
                    self.saveState();
                });
        }, delay);
    }

    private getKeyPath(lang, location, trKey): any[] | string[] {
        let json = this.originalTranslations[`${lang}/${location}`];
        if (!json) {
            json = this.originalTranslations[`en/${location}`];
        }
        const keyPath = [];
        let passedPath = '';
        while (passedPath.length < trKey.length) {
            let key = trKey.substring(passedPath.length);
            while (key.length > 0) {
                if (!json.hasOwnProperty(key) && key.indexOf('.') < 0) {
                    return trKey.split('.');
                }
                if (json.hasOwnProperty(key)) {
                    passedPath = passedPath + '.' + key;
                    keyPath.push(key);
                    json = json[key];

                    break;
                } else {
                    key = key.substring(0, key.lastIndexOf('.'));
                }
            }
        }
        return keyPath;
    }

    private assignProperty(json, jsonPath, value): void {
        let lastSubObject;
        let lastProperty;
        let currectSubObject = json;
        for (const property of jsonPath) {
            if (!currectSubObject[property]) {
                currectSubObject[property] = {};
            }

            lastSubObject = currectSubObject;
            currectSubObject = currectSubObject[property];
            lastProperty = property;
        }
        if (lastProperty) {
            if (!value) {
                value = '';
            }
            lastSubObject[lastProperty] = value;
        }
    }

}
