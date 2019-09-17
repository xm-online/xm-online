import {FieldOptions} from '../../xm-entity/entity-list-card/entity-list-card-options.model';

export class TranslationSet {
    [language: string]: string;
}

export type AttachmentsView = 'list' | '';

export class EntityAttachmentsUiConfig {
    public view: AttachmentsView;
    public noData: TranslationSet;
}

export class EntityLocationsUiConfig {
    public noData: TranslationSet;
}

export class EntityLinkUiConfig {
    public typeKey: string;
    public fields: FieldOptions[];
}

export type EntityDetailLayout = 'DEFAULT' | 'ALL-IN-ROW';

export class EntityUiConfig {
    public typeKey: string;
    public detailLayoutType: EntityDetailLayout;
    public fields?: FieldOptions[]; // TODO: FieldOptions is a UI config item. It can be moved here to keep all in one place.
    public attachments?: EntityAttachmentsUiConfig;
    public locations?: EntityLocationsUiConfig;
    public links?: { items: EntityLinkUiConfig[] };
    public noData?: TranslationSet;
}

