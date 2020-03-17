import { Component, Input } from '@angular/core';
import { XmUiConfigService } from '@xm-ngx/core';
import { environment, IEnvironment , getServerEnvironment} from '@xm-ngx/core/environment';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'xm-ribbon',
    templateUrl: './xm-ribbon.component.html',
    styleUrls: ['./xm-ribbon.component.scss'],
})
export class XmRibbonComponent {
    @Input() public environment: IEnvironment = environment;

    public show$: Observable<boolean>;
    public serverEnv: string = getServerEnvironment();

    constructor(protected uiConfigService: XmUiConfigService<{ ribbon: boolean }>) {
    }

    public ngOnInit(): void {
        this.show$ = this.uiConfigService.cache$.pipe(
            filter((i) => Boolean(i)),
            map((i) => i.ribbon),
        );
    }
}
