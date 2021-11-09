/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UtensilComponent } from './utensil.component';

describe('UtensilComponent', () => {
  let component: UtensilComponent;
  let fixture: ComponentFixture<UtensilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtensilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtensilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
