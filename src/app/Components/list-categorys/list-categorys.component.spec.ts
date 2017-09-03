import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCategorysComponent } from './list-categorys.component';

describe('ListCategorysComponent', () => {
  let component: ListCategorysComponent;
  let fixture: ComponentFixture<ListCategorysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCategorysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCategorysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
