import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseEditComponent } from './house-edit.component';

describe('HouseEditComponent', () => {
  let component: HouseEditComponent;
  let fixture: ComponentFixture<HouseEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HouseEditComponent]
    });
    fixture = TestBed.createComponent(HouseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
