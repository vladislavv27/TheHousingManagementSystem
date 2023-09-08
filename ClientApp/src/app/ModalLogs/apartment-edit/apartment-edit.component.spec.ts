import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentEditComponent } from './apartment-edit.component';

describe('ApartmentEditComponent', () => {
  let component: ApartmentEditComponent;
  let fixture: ComponentFixture<ApartmentEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApartmentEditComponent]
    });
    fixture = TestBed.createComponent(ApartmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
