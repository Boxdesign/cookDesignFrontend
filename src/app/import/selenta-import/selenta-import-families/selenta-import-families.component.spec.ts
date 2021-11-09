import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelentaImportFamiliesComponent } from './selenta-import-families.component';

describe('SelentaImportFamiliesComponent', () => {
  let component: SelentaImportFamiliesComponent;
  let fixture: ComponentFixture<SelentaImportFamiliesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelentaImportFamiliesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelentaImportFamiliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
