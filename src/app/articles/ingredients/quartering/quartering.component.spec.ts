/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QuarteringComponent } from './quartering.component';

describe('QuarteringComponent', () => {
  let component: QuarteringComponent;
  let fixture: ComponentFixture<QuarteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuarteringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuarteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
