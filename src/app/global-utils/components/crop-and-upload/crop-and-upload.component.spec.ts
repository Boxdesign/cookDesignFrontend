import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropAndUploadComponent } from './crop-and-upload.component';

describe('CropAndUploadComponent', () => {
  let component: CropAndUploadComponent;
  let fixture: ComponentFixture<CropAndUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropAndUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropAndUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
