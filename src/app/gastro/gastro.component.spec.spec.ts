/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GastroComponent } from './gastro.component';

describe('GastroOfferComponent', () => {
  let component: GastroComponent;
  let fixture: ComponentFixture<GastroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GastroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
