import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmSharedTestingModule } from '@xm-ngx/shared';
import { LoginService } from '../../shared';

import { LogoutComponent } from './logout.component';

describe('LogoutComponent', () => {
    let component: LogoutComponent;
    let fixture: ComponentFixture<LogoutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmSharedTestingModule, HttpClientTestingModule],
            declarations: [LogoutComponent],
            providers: [{provide: LoginService, useValue: {}}],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LogoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
