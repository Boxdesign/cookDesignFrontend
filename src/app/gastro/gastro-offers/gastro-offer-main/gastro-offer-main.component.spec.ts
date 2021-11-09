/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GastroOfferMainComponent } from './gastro-offer-main.component';

describe('GastroOfferMainComponent', () => {
  let component: GastroOfferMainComponent;
  let fixture: ComponentFixture<GastroOfferMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GastroOfferMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GastroOfferMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
