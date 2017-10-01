import {Component, Injector, OnInit} from '@angular/core';
import {WidgetService} from "../../../entities/widget/widget.service";
import {Widget} from "../../../entities/widget/widget.model";

declare let $:any;
declare let SimpleMDE:any;

@Component({
    selector: 'xm-widget-md',
    templateUrl: './xm-widget-md.component.html',
    styleUrls: ['./xm-widget-md.component.css']
})
export class XmWidgetMdComponent implements OnInit {

    name: any;
    config: any;
    mdEditor: any;
    isEditMode: boolean;

    constructor(
        private injector: Injector,
        private widgetService: WidgetService,
    ) {
        this.config = this.injector.get('config') || {};
        this.name = this.config.name;
    }

    ngOnInit() {
        this.mdEditor = new SimpleMDE({
            element: $('#xm-widget-md')[0],
        });
        this.mdEditor.value(this.config.content);
        this.mdEditor.togglePreview();
    }

    onEditMode() {
        this.isEditMode = !this.isEditMode;
        this.mdEditor.togglePreview();
    }

    onSave() {
        this.widgetService.find(this.config.id)
            .subscribe((result: Widget) => {
                result.config = result.config || {};
                Object.assign(result.config, {content: this.mdEditor.value()});
                this.widgetService.update(result)
                    .subscribe(result => this.onEditMode())
                ;
            });
    }
}
