/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DishPricingEditComponent } from './dish-pricing-edit.component';

describe('DishPricingEditComponent', () => {
  let component: DishPricingEditComponent;
  let fixture: ComponentFixture<DishPricingEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DishPricingEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishPricingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
