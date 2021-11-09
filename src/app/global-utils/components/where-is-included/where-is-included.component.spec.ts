/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WhereIsIncludedComponent } from './where-is-included.component';

describe('WhereIsIncludedComponent', () => {
  let component: WhereIsIncludedComponent;
  let fixture: ComponentFixture<WhereIsIncludedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhereIsIncludedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhereIsIncludedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
