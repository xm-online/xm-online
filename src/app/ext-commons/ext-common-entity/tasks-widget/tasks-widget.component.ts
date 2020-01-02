import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { EntityDetailDialogComponent, Spec, XmEntity, XmEntityService, XmEntitySpec } from '../../../xm-entity';

function sort(a: any, b: any): number {
    if (a.typeKey < b.typeKey) {
        return -1;
    }
    if (a.typeKey > b.typeKey) {
        return 1;
    }
    return 0;
}

@Component({
    selector: 'xm-tasks-widget',
    templateUrl: './tasks-widget.component.html',
    styleUrls: ['./tasks-widget.component.scss'],
})
export class TasksWidgetComponent implements OnInit, OnDestroy {

    public config: any;
    public spec: Spec;
    public tasks: any[];
    public activeId: number = 0;
    private xmEntityListModificationSubscriber: Subscription;
    private xmEntityDetailModificationSubscriber: Subscription;

    constructor(private eventManager: JhiEventManager,
                private modalService: NgbModal,
                private xmEntityService: XmEntityService) {
    }

    public ngOnInit(): void {
        this.registerChangeInXmEntities();
        this.load();
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.xmEntityListModificationSubscriber);
        this.eventManager.destroy(this.xmEntityDetailModificationSubscriber);
    }

    public load(): void {
        this.xmEntityService.query({
            typeKey: this.config.rootTypeKey,
            page: 0,
            size: 1000,
        }).subscribe(
            (res: HttpResponse<XmEntity[]>) => this.prepareData(res.body),
            (err) => console.warn(err),
        );
    }

    public prepareData(data: any): void {
        const filteredData = data.filter((e) => e.stateKey !== 'REJECTED');
        this.tasks = [];
        filteredData.map((e) => {
            let group = this.tasks.filter((tg) => tg.typeKey === e.typeKey)[0];
            if (!group) {
                group = {
                    typeKey: e.typeKey,
                    title: this.getType(e.typeKey).name.en,
                    list: [],
                };
                this.tasks.push(group);
            }
            group.list.push({
                isChecked: e.stateKey === 'DONE',
                title: e.name + ' > ' + e.description,
                typeKey: e.typeKey,
                id: e.id,
                xmEntity: e,
            });
        });
        this.tasks.sort(sort);
        for (const i of this.tasks) {
            i.list = i.list.sort((a, b) => {
                if (a.id < b.id) {
                    return -1;
                }
                if (a.id > b.id) {
                    return 1;
                }
                return 0;
            });
        }
    }

    public setActive(i: any): void {
        this.activeId = i;
    }

    public registerChangeInXmEntities(): void {
        this.xmEntityListModificationSubscriber = this.eventManager
            .subscribe('xmEntityListModification', (response) => this.load());
        this.xmEntityDetailModificationSubscriber = this.eventManager
            .subscribe('xmEntityDetailModification', (response) => this.load());
    }

    public getType(typeKey: string): XmEntitySpec {
        return this.spec.types.filter((t) => t.key === typeKey).shift();
    }

    public onRemove(task: any): void {
        this.xmEntityService.changeState(task.id, 'REJECTED').subscribe(() => {
            this.eventManager.broadcast({name: 'xmEntityListModification'});
        });
    }

    public onChange(task: any): void {
        this.xmEntityService.changeState(task.id, task.isChecked ? 'TODO' : 'DONE').subscribe(() => {
            this.eventManager.broadcast({name: 'xmEntityListModification'});
        });
    }

    public onEdit(item: any): void {
        const modalRef = this.modalService.open(EntityDetailDialogComponent, {backdrop: 'static'});
        modalRef.componentInstance.xmEntity = Object.assign({}, item.xmEntity);
        modalRef.componentInstance.xmEntitySpec = this.getType(item.typeKey);
    }

}
