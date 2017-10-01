import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {XmEntityService} from '../../../entities/xm-entity/xm-entity.service';
import {EventManager, JhiLanguageService} from 'ng-jhipster';
import {Response} from '@angular/http';
import {XmEntitySpecService} from '../../../shared/spec/spec.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'xm-widget-tasks',
    templateUrl: './xm-widget-tasks.component.html'
})
export class XmWidgetTasksComponent implements OnInit, OnDestroy {

    config: any;
    tasks: any[];
    activeId = 0;
    private eventSubscriber: Subscription;

    constructor(private eventManager: EventManager,
                private injector: Injector,
                private xmEntityService: XmEntityService,
                private xmEntitySpecService: XmEntitySpecService,
                private jhiLanguageService: JhiLanguageService) {
        this.jhiLanguageService.addLocation('widget-task');
        this.config = this.injector.get('config') || {};
    }

    ngOnInit() {
        this.registerChangeInXmEntities();
        this.load();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    load() {
        this.xmEntityService.query({
            typeKey: this.config.rootTypeKey,
            page: 0,
            size: 1000
        }).subscribe(
            (res: Response) => this.prepareDate(res.json()),
            (res: Response) => console.log('Error')
        );
    }

    prepareDate(data: any) {
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
            });
        });
        this.tasks = this.tasks.sort((a, b) => {
            if (a.typeKey < b.typeKey) { return -1; }
            if (a.typeKey > b.typeKey) { return 1; }
            return 0;
        });
        for (let i = 0; i < this.tasks.length; i++) {
            this.tasks[i].list = this.tasks[i].list.sort((a, b) => {
                if (a.id < b.id) { return -1; }
                if (a.id > b.id) { return 1; }
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
        this.eventSubscriber = this.eventManager.subscribe('xmEntityListModification', (response) => this.load());
    }

    getType(typeKey: string) {
        return this.xmEntitySpecService.getType(typeKey);
    }

    onRemove(task: any) {
        this.xmEntityService.changeState(task.id, 'REJECTED').subscribe((response) => {
            this.eventManager.broadcast({
                name: 'xmEntityListModification',
                content: 'Change a xmEntity'
            });
        });
    }

    onChange(task: any) {
        this.xmEntityService.changeState(task.id, task.isChecked ? 'TODO' : 'DONE').subscribe((response) => {
            this.eventManager.broadcast({
                name: 'xmEntityListModification',
                content: 'Change a xmEntity'
            });
        });
    }

}
