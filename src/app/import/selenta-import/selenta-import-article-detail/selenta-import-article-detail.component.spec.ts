import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelentaImportArticleDetailComponent } from './selenta-import-article-detail.component';

describe('SelentaImportArticleDetailComponent', () => {
  let component: SelentaImportArticleDetailComponent;
  let fixture: ComponentFixture<SelentaImportArticleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelentaImportArticleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelentaImportArticleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
