/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PackFormatComponent } from './pack-format.component';

describe('PackFormatComponent', () => {
  let component: PackFormatComponent;
  let fixture: ComponentFixture<PackFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
