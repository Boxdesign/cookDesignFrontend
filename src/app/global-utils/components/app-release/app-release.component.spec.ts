import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReleaseComponent } from './app-release.component';

describe('AppReleaseComponent', () => {
  let component: AppReleaseComponent;
  let fixture: ComponentFixture<AppReleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
