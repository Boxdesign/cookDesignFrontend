import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientPrintComponent } from './ingredient-print.component';

describe('IngredientPrintComponent', () => {
  let component: IngredientPrintComponent;
  let fixture: ComponentFixture<IngredientPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
