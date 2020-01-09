import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xm-sidebar',
    host: {
        class: 'xm-sidebar',
    },
    templateUrl: './sidebar.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {

}
