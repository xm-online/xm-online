import { LanguageService } from './language.service';

/** @deprecated Use the LanguageService instead. */
export class XmJhiLanguageService {

    constructor(protected languageService: LanguageService) {
    }

    /** @deprecated Use the LanguageService locale instead. */
    public get currentLang(): string {
        return this.languageService.locale;
    }

    /** @deprecated Use the LanguageService init instead. */
    public init(): void {
        this.languageService.init();
    }

    /** @deprecated Use the LanguageService locale instead. */
    public changeLanguage(languageKey: string): void {
        this.languageService.locale = languageKey;
    }

    /**
     * @deprecated Will be removed when releasing generator-jhipster v7
     * Use the LanguageService locale$ instead.
     */
    public getCurrent(): Promise<string> {
        return Promise.resolve(this.languageService.locale);
    }

    /** @deprecated Use the LanguageService locale instead. */
    public getCurrentLanguage(): string {
        return this.languageService.locale;
    }

}
