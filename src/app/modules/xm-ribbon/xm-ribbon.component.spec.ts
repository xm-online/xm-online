import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmRibbonComponent } from './xm-ribbon.component';

describe('XmRibbonComponent', () => {
  let component: XmRibbonComponent;
  let fixture: ComponentFixture<XmRibbonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmRibbonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmRibbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
