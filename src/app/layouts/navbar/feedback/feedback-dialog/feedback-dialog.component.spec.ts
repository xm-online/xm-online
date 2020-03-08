import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { XmSharedTestingModule } from '@xm-ngx/shared';

import { FeedbackDialogComponent } from './feedback-dialog.component';

describe('FeedbackDialogComponent', () => {
    let component: FeedbackDialogComponent;
    let fixture: ComponentFixture<FeedbackDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [XmSharedTestingModule, HttpClientTestingModule],
            providers: [{provide: MatDialogRef, useValue: {}}],
            declarations: [FeedbackDialogComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FeedbackDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
