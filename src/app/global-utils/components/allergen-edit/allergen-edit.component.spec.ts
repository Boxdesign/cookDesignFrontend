import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllergenEditComponent } from './allergen-edit.component';

describe('AllergenEditComponent', () => {
  let component: AllergenEditComponent;
  let fixture: ComponentFixture<AllergenEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllergenEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllergenEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
