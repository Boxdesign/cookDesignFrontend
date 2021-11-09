/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SelentaImportConflictsComponent } from './selenta-import-conflicts.component';

describe('SelentaImportConflictsComponent', () => {
  let component: SelentaImportConflictsComponent;
  let fixture: ComponentFixture<SelentaImportConflictsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelentaImportConflictsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelentaImportConflictsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});