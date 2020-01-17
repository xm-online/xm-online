import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { map, share } from 'rxjs/operators';

@Component({
    selector: 'xm-clock-widget',
    templateUrl: './clock-widget.component.html',
    styleUrls: ['./clock-widget.component.scss'],
})
export class ClockWidgetComponent implements OnInit, OnDestroy {

    public clock: any;
    private subscription: any;

    public ngOnInit(): void {
        this.subscription = interval(1000).pipe(map((tick) => new Date()),
            share(),
        ).subscribe((result) => {
            this.clock = result.toLocaleString();
        });
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
