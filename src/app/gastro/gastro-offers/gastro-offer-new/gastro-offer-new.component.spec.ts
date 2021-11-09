/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GastroOfferNewComponent } from './gastro-offer-new.component';

describe('GastroOfferNewComponent', () => {
  let component: GastroOfferNewComponent;
  let fixture: ComponentFixture<GastroOfferNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GastroOfferNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GastroOfferNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
