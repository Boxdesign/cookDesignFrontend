import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingPrintComponent } from './packaging-print.component';

describe('PackagingPrintComponent', () => {
  let component: PackagingPrintComponent;
  let fixture: ComponentFixture<PackagingPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackagingPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagingPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
