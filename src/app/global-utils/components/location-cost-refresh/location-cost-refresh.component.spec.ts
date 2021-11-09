import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationCostRefreshComponent } from './location-cost-refresh.component';

describe('LocationCostRefreshComponent', () => {
  let component: LocationCostRefreshComponent;
  let fixture: ComponentFixture<LocationCostRefreshComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationCostRefreshComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationCostRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
