/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GastroOfferPrintComponent } from './gastro-offer-print.component';

describe('GastroOfferPrintComponent', () => {
  let component: GastroOfferPrintComponent;
  let fixture: ComponentFixture<GastroOfferPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GastroOfferPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GastroOfferPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
