import { FieldOptions } from '../../xm-entity/entity-list-card/entity-list-card-options.model';

export class TranslationSet {
    [language: string]: string;
}

export type AttachmentsView = 'list' | '';

export interface EntityAttachmentsUiConfig {
    view: AttachmentsView;
    noData: TranslationSet;
}

export interface EntityLocationsUiConfig {
    noData: TranslationSet;
}

export interface EntityLinkUiConfig {
    typeKey: string;
    fields: FieldOptions[];
}

export type EntityDetailLayout = 'DEFAULT' | 'ALL-IN-ROW' | 'COMPACT';

export interface EntityUiConfig {
    typeKey: string;
    detailLayoutType: EntityDetailLayout;
    fields?: FieldOptions[]; // TODO: FieldOptions is a UI config item. It can be moved here to keep all in one place.
    attachments?: EntityAttachmentsUiConfig;
    locations?: EntityLocationsUiConfig;
    links?: { items: EntityLinkUiConfig[] };
    noData?: TranslationSet;
}
