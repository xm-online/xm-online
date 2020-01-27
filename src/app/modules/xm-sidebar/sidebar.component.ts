import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'xm-sidebar',
    host: {
        class: 'xm-sidebar',
    },
    styleUrls: ['./sidebar.component.scss'],
    templateUrl: './sidebar.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class SidebarComponent {

}
