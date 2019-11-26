import { FastSearchSpec } from '../shared/fast-search-spec.model';
import { XmEntitySpec } from '../shared/xm-entity-spec.model';
import { XmEntity } from '../shared/xm-entity.model';

export class EntityListCardOptions {
    constructor(public entities?: EntityOptions[],
                public hideDelete?: boolean,
                public smOverflow?: boolean,
                public hideExport?: boolean,
                public hideOptionsMenu?: boolean,
                public noDeepLink?: boolean) {
    }
}

export class EntityOptions {
    constructor(public typeKey?: string,
                public query?: string,
                public currentQuery?: string,
                public name?: any,
                public fastSearch?: FastSearchSpec[],
                public hideDelete?: boolean,
                public noDeepLink?: boolean,
                public fields?: FieldOptions[],
                public noData?: any,
                public page?: number,
                public xmEntitySpec?: XmEntitySpec,
                public entities?: XmEntity[],
                public totalItems?: any,
                public queryCount?: any,
                public routerLink?: string[],
                public filter?: FilterOptions) {
    }
}

export class FieldOptions {
    constructor(public field?: string,
                public title?: any,
                public hiddenTitle?: boolean,
                public useKeyword?: boolean,
                public func?: string,
                public action?: ActionOptions,
                public actions?: ActionsOptions[],
                public actionsListPrivileges?: string[],
                public sortable?: boolean) {
    }
}

export class ActionOptions {
    constructor(public name?: any,
                public functionKey?: string,
                public handler?: (entity: XmEntity) => any,
                public actionCondition?: (entity: XmEntity) => any) {
    }
}

export class ActionsOptions {
    constructor(public name?: any,
                public functionKey?: string,
                public privilege?: string[],
                public handler?: (entity: XmEntity) => any,
                public actionCondition?: (entity: XmEntity) => any) {
    }
}

export class FilterOptions {
    constructor(public template?: string,
                public dataSpec?: string,
                public dataForm?: string) {
    }
}
