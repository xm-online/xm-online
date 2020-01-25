/**
 * Returns a first locale from the windows.navigator.languages
 */
export function getBrowserLocale(): string | null {
    const w: typeof window = window;

    if (typeof w === 'undefined' || typeof w.navigator === 'undefined') {
        return null;
    }

    let browserLang = w.navigator.languages ? w.navigator.languages[0] : null;
    browserLang = browserLang
        || w.navigator.language
        || (w.navigator as any).browserLanguage
        || (w.navigator as any).userLanguage;
    if (browserLang.indexOf('-') !== -1) {
        browserLang = browserLang.split('-')[0];
    }
    if (browserLang.indexOf('_') !== -1) {
        browserLang = browserLang.split('_')[0];
    }
    return browserLang;
}
