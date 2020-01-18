import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { I18nNamePipe, Principal, XmConfigService } from '../shared';
import { LIST_DEFAULT_FIELDS } from '../shared/constants/default-lists-fields.constants';
import { DashboardWrapperService } from '../xm-dashboard';
import { Link, Spec, XmEntitySpec, XmEntitySpecWrapperService } from '../xm-entity';
import { EntityListCardOptions } from '../xm-entity/entity-list-card/entity-list-card-options.model';

@Component({
    selector: 'xm-entity',
    templateUrl: './application.component.html',
})
export class ApplicationComponent implements OnInit, OnDestroy {

    public options: EntityListCardOptions;
    public isSearch: boolean = false;
    public searchQuery: string;
    public currentAccount: any;
    public error: any;
    public success: any;
    public links: Link[];
    public totalItems: any;
    public queryCount: any;
    public itemsPerPage: any;
    public page: any;
    public predicate: any;
    public previousPage: any;
    public reverse: any;
    public typeKey: string;
    public entityType: any;
    public types: any;
    public spec: Spec;
    public searchParams: any;
    public spec$: Observable<Spec>;
    public uiConfig: any;
    public defaultFieldsKeys: string[] = [
        LIST_DEFAULT_FIELDS.name,
        LIST_DEFAULT_FIELDS.typeKey,
        LIST_DEFAULT_FIELDS.startDate,
        LIST_DEFAULT_FIELDS.stateKey,
    ];
    private routeData: any;
    private routeDataSubscription: Subscription;
    private routeParamsSubscription: Subscription;
    private routeQueryParamsSubscription: Subscription;

    constructor(protected translateService: TranslateService,
                protected xmEntitySpecWrapperService: XmEntitySpecWrapperService,
                protected xmConfigService: XmConfigService,
                protected principal: Principal,
                protected activatedRoute: ActivatedRoute,
                protected router: Router,
                protected modalService: NgbModal,
                protected eventManager: JhiEventManager,
                protected i18nNamePipe: I18nNamePipe,
                protected dashboardWrapperService: DashboardWrapperService) {
        this.searchQuery = activatedRoute.snapshot.params.search ? activatedRoute.snapshot.params.search : '';
    }

    // tslint:disable-next-line:cognitive-complexity
    public ngOnInit(): void {
        if (!environment.production) {
            console.info('ApplicationComponent.ngOnInit');
        }

        this.spec$ = this.xmEntitySpecWrapperService.specv2();

        this.xmConfigService.getUiConfig().subscribe((result) => {
            this.uiConfig = result;
            this.xmEntitySpecWrapperService.spec().then((spec) => {
                this.spec = spec;
                this.routeDataSubscription = this.activatedRoute.data.subscribe((data) => {
                    if (data.pagingParams) {
                        this.itemsPerPage = data.pagingParams.size;
                        this.page = data.pagingParams.page;
                        this.previousPage = data.pagingParams.page;
                        this.reverse = data.pagingParams.ascending;
                        this.predicate = data.pagingParams.predicate;
                        this.routeData = data;
                        if (this.entityType && this.entityType.name) {
                            this.routeData.pageSubTitle = this.i18nNamePipe.transform(
                                this.entityType.name,
                                this.principal);

                        }
                    }
                });
                this.routeParamsSubscription = this.activatedRoute.params.subscribe((params) => {
                    if (params.key) {
                        this.typeKey = params.key;
                        this.spec$.subscribe((s) => {
                            this.entityType = this.getTypeFromSpec(s, this.typeKey);
                            this.load();

                            if (this.entityType && this.entityType.name) {
                                this.routeData.pageSubTitle = this.i18nNamePipe.transform(
                                    this.entityType.name,
                                    this.principal);

                            }
                        });
                    }
                });
                this.routeQueryParamsSubscription = this.activatedRoute.queryParams.subscribe((params) => {
                    if (params.query) {
                        this.isSearch = true;
                        this.searchQuery = params.query;
                        this.getSearchConfig(params.dashboardId)
                            .subscribe((config) => {
                                this.searchParams = config;
                                this.load();
                            });

                        this.routeData.pageSubTitle = `[${params.query}]`;

                    }
                });
            });
        }, (err) => {
            console.info(err);
        });

        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
    }

    public load(): void {
        this.translateService.get(this.defaultFieldsKeys).subscribe(() => {
            const defaultFields = this.buildDefaultFields();
            // eslint-disable-next-line no-unused-expressions
            this.searchParams && this.searchParams.fields
                ? this.buildOptions(this.searchParams.fields)
                : this.buildOptions(defaultFields);
        });
    }

    public loadPage(page: number): void {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    public transition(): void {
        this.router.navigate([`/application`, this.typeKey], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.searchQuery,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
            },
        }).then(() => this.load());
    }

    public clear(): void {
        this.page = 0;
        this.searchQuery = '';
        this.router.navigate(['/application', this.typeKey], {
            queryParams: {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
            },
        }).then(() => this.load());
    }

    public ngOnDestroy(): void {
        if (this.routeParamsSubscription) {
            this.routeParamsSubscription.unsubscribe();
        }
        if (this.routeDataSubscription) {
            this.routeDataSubscription.unsubscribe();
        }
        if (this.routeQueryParamsSubscription) {
            this.routeQueryParamsSubscription.unsubscribe();
        }
    }

    // tslint:disable-next-line:cognitive-complexity
    protected buildOptions(defaultFields: any): void {
        const config = this.getListConfig();

        const fields = config && config.fields ? config.fields : defaultFields;

        if (this.isSearch) {
            this.options = {
                hideDelete: config && config.hideDelete,
                entities: [
                    {
                        currentQuery: (config ? config.query : '') + this.searchQuery,
                        name: `[${this.searchQuery}]`,
                        fields,
                        routerLink: config && config.routerLink ? config.routerLink : null,
                    },
                ],
            };
        } else {
            this.entityType = this.getTypeFromSpec(this.spec, this.typeKey) || '';
            this.options = {
                hideDelete: config && config.hideDelete,
                entities: [
                    {
                        typeKey: this.typeKey,
                        name: this.entityType.pluralName ? this.entityType.pluralName : this.entityType.name,
                        fastSearch: config && config.fastSearch ? config.fastSearch : this.entityType.fastSearch,
                        fields,
                        routerLink: config && config.routerLink ? config.routerLink : null,
                        filter: config && config.filter ? config.filter : null,
                        noData: config && config.noData ? config.noData : null,
                    },
                ],
            };
        }
    }

    protected getListConfig(): null | any {
        if (this.isSearch) {
            return this.getSearchPattern();
        } else {
            const entitiesConfig = this.uiConfig.applications && this.uiConfig.applications.config &&
                this.uiConfig.applications.config.entities;
            if (entitiesConfig) {
                return entitiesConfig.filter((c) => c.typeKey === this.typeKey).shift();
            }
        }
        return null;
    }

    private buildDefaultFields(): any[] {
        return ['name', 'typeKey', 'startDate', 'stateKey'].map((item) => this.newField(item));
    }

    private newField(name: string): { field: string; title: string | any } {
        return {
            field: name,
            title: this.translateService.instant(LIST_DEFAULT_FIELDS[name]),
        };
    }

    private getSearchPattern(): any | null {
        if (this.uiConfig.search && this.uiConfig.search.patterns) {
            for (const pattern of this.uiConfig.search.patterns) {
                const re = new RegExp(pattern.regexp);
                if (re.test(this.searchQuery)) {
                    return pattern;
                }
            }
        }
        return null;
    }

    private getTypeFromSpec(spec: Spec, typeKey: string): XmEntitySpec | undefined {
        return spec.types.filter((t) => t.key === typeKey).shift();
    }

    private getSearchConfig(idOrSlug: any): Observable<any> {
        if (idOrSlug) {
            return this.dashboardWrapperService.getDashboardByIdOrSlug(idOrSlug).pipe(
                map((dash) => dash && dash.config),
                map((config) => config && config.search),
            );
        } else { return of(''); }
    }
}
