import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { EntityDetailDialogComponent, Spec, XmEntity, XmEntityService } from '../../../xm-entity';

@Component({
    selector: 'xm-tasks-widget',
    templateUrl: './tasks-widget.component.html',
    styleUrls: ['./tasks-widget.component.scss']
})
export class TasksWidgetComponent implements OnInit, OnDestroy {

    private xmEntityListModificationSubscriber: Subscription;
    private xmEntityDetailModificationSubscriber: Subscription;

    config: any;
    spec: Spec;
    tasks: any[];
    activeId = 0;

    constructor(private eventManager: JhiEventManager,
                private modalService: NgbModal,
                private xmEntityService: XmEntityService) {
    }

    ngOnInit() {
        this.registerChangeInXmEntities();
        this.load();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.xmEntityListModificationSubscriber);
        this.eventManager.destroy(this.xmEntityDetailModificationSubscriber);
    }

    load() {
        this.xmEntityService.query({
            typeKey: this.config.rootTypeKey,
            page: 0,
            size: 1000
        }).subscribe(
            (res: HttpResponse<XmEntity[]>) => this.prepareData(res.body),
            (err) => console.log(err)
        );
    }

    prepareData(data: any) {
        const filteredData = data.filter(e => e.stateKey !== 'REJECTED');
        this.tasks = [];
        filteredData.map(e => {
            let group = this.tasks.filter(tg => tg.typeKey === e.typeKey)[0];
            if (!group) {
                group = {
                    typeKey: e.typeKey,
                    title: this.getType(e.typeKey).name.en,
                    list: []
                };
                this.tasks.push(group);
            }
            group.list.push({
                isChecked: e.stateKey === 'DONE',
                title: e.name + ' > ' + e.description,
                typeKey: e.typeKey,
                id: e.id,
                xmEntity: e
            });
        });
        this.tasks = this.tasks.sort((a, b) => {
            if (a.typeKey < b.typeKey) {
                return -1;
            }
            if (a.typeKey > b.typeKey) {
                return 1;
            }
            return 0;
        });
        for (let i = 0; i < this.tasks.length; i++) {
            this.tasks[i].list = this.tasks[i].list.sort((a, b) => {
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

    sort(a, b) {
        if (a.typeKey < b.typeKey) {
            return -1;
        }
        if (a.typeKey > b.typeKey) {
            return 1;
        }
        return 0;
    }

    setActive(i) {
        this.activeId = i;
    }

    registerChangeInXmEntities() {
        this.xmEntityListModificationSubscriber = this.eventManager.subscribe('xmEntityListModification', (response) => this.load());
        this.xmEntityDetailModificationSubscriber = this.eventManager.subscribe('xmEntityDetailModification', (response) => this.load());
    }

    getType(typeKey: string) {
        return this.spec.types.filter(t => t.key === typeKey).shift();
    }

    onRemove(task: any) {
        this.xmEntityService.changeState(task.id, 'REJECTED').subscribe(() => {
            this.eventManager.broadcast({name: 'xmEntityListModification'});
        });
    }

    onChange(task: any) {
        this.xmEntityService.changeState(task.id, task.isChecked ? 'TODO' : 'DONE').subscribe(() => {
            this.eventManager.broadcast({name: 'xmEntityListModification'});
        });
    }

    public onEdit(item): void {
        const modalRef = this.modalService.open(EntityDetailDialogComponent, {backdrop: 'static'});
        modalRef.componentInstance.xmEntity = Object.assign({}, item.xmEntity);
        modalRef.componentInstance.xmEntitySpec = this.getType(item.typeKey);
    }

}
