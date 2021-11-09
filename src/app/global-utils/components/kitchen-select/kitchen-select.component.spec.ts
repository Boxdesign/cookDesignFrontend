import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenSelectComponent } from './kitchen-select.component';

describe('KitchenSelectComponent', () => {
  let component: KitchenSelectComponent;
  let fixture: ComponentFixture<KitchenSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KitchenSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitchenSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
