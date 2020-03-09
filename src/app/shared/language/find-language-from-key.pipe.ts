import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'findLanguageFromKey'})
export class FindLanguageFromKeyPipe implements PipeTransform {
    private languages: { [key: string]: { name: string } } = {
        uk: {name: 'Українська'},
        ca: {name: 'Català'},
        cs: {name: 'Český'},
        da: {name: 'Dansk'},
        de: {name: 'Deutsch'},
        el: {name: 'Ελληνικά'},
        en: {name: 'English'},
        es: {name: 'Español'},
        et: {name: 'Eesti'},
        fr: {name: 'Français'},
        gl: {name: 'Galego'},
        hu: {name: 'Magyar'},
        hi: {name: 'हिंदी'},
        hy: {name: 'Հայերեն'},
        it: {name: 'Italiano'},
        ja: {name: '日本語'},
        ko: {name: '한국어'},
        mr: {name: 'मराठी'},
        nl: {name: 'Nederlands'},
        pl: {name: 'Polski'},
        'pt-br': {name: 'Português (Brasil)'},
        'pt-pt': {name: 'Português'},
        ro: {name: 'Română'},
        ru: {name: 'Русский'},
        sk: {name: 'Slovenský'},
        sr: {name: 'Srpski'},
        sv: {name: 'Svenska'},
        ta: {name: 'தமிழ்'},
        th: {name: 'ไทย'},
        tr: {name: 'Türkçe'},
        vi: {name: 'Tiếng Việt'},
        'zh-cn': {name: '中文（简体）'},
        'zh-tw': {name: '繁體中文'},
        // Jhipster-needle-i18n-language-key-pipe - JHipster will add/remove languages in this object
    };

    public transform(lang: string): string {
        return this.languages[lang].name;
    }
}
