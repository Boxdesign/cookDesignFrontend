import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPrintLibrariesComponent } from './report-print-libraries.component';

describe('ReportPrintLibrariesComponent', () => {
  let component: ReportPrintLibrariesComponent;
  let fixture: ComponentFixture<ReportPrintLibrariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPrintLibrariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPrintLibrariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
