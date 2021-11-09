import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationProviderComponent } from './location-provider.component';

describe('LocationProviderComponent', () => {
  let component: LocationProviderComponent;
  let fixture: ComponentFixture<LocationProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
