import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Widget, WidgetService } from '../../../xm-dashboard/';

declare let $: any;
declare let SimpleMDE: any;

@Component({
    selector: 'xm-md-widget',
    templateUrl: './md-widget.component.html',
    styleUrls: ['./md-widget.component.scss']
})
export class MdWidgetComponent implements OnInit {

    name: any;
    config: any;
    mdEditor: any;
    isEditMode: boolean;

    constructor(private widgetService: WidgetService) {
    }

    ngOnInit() {
        this.name = this.config.name;
        this.mdEditor = new SimpleMDE({
            element: $('#xm-widget-md')[0]
        });
        this.mdEditor.value(this.config.content);
        this.mdEditor.togglePreview();
    }

    onEditMode() {
        this.isEditMode = !this.isEditMode;
        this.mdEditor.togglePreview();
    }

    onSave() {
        this.widgetService.find(this.config.id).subscribe((result: HttpResponse<Widget>) => {
            const widget: Widget = result.body;
            widget.config = widget.config || {};
            Object.assign(widget.config, {content: this.mdEditor.value()});
            this.widgetService.update(widget).subscribe(() => this.onEditMode());
        });
    }

}
