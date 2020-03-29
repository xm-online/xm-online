import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitySpecMngComponent } from './entity-spec-mng.component';

describe('TenantSpecMngComponent', () => {
  let component: EntitySpecMngComponent;
  let fixture: ComponentFixture<EntitySpecMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntitySpecMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitySpecMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
